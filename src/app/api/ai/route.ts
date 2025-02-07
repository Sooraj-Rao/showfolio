import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import PDFParser from "pdf2json";
import axios from "axios"; // To fetch the file from Firebase URL

type Mode = "feedback";
type ResponseLength = "short" | "medium" | "descriptive";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
export async function GET() {
  return NextResponse.json({ message: "GET request successful" });
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const firebaseUrl = formData.get("firebaseUrl") as string | null; // Firebase URL of the resume
    const mode = (formData.get("mode") as Mode) || "feedback";
    const responseLength =
      (formData.get("responseLength") as ResponseLength) || "medium";
    const userQuery = formData.get("query") as string | null; // Query from the user

    if (!firebaseUrl) {
      return NextResponse.json(
        { error: "No Firebase URL provided" },
        { status: 400 }
      );
    }

    // Fetch resume from Firebase URL
    const response = await axios.get(firebaseUrl, {
      responseType: "arraybuffer",
    });
    const buffer = Buffer.from(response.data);

    // Parse the PDF content from the buffer
    const resumeText = await parsePdf(buffer);

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: "Unable to extract readable text from resume" },
        { status: 400 }
      );
    }

    // Construct prompt for Gemini based on feedback and query
    const prompt = createPrompt(resumeText, userQuery, mode, responseLength);

    const result = await genAI
      .getGenerativeModel({
        model: "gemini-1.5-flash", // Gemini model
      })
      .generateContent(prompt);

    const responseContent = result.response.text();

    return NextResponse.json({
      result: responseContent,
      mode: mode,
      responseLength: responseLength,
    });
  } catch (error) {
    console.error("Processing error:", error);
    return NextResponse.json(
      {
        error: "Failed to process resume",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

const createPrompt = (
  resumeText: string,
  userQuery: string | null,
  mode: Mode,
  responseLength: ResponseLength
): string => {
  const wordLimit =
    responseLength === "short" ? 100 : responseLength === "medium" ? 250 : 350;

  const sectionStructure = `1. **Experience Section**: Provide feedback on the clarity, relevance, and impact of the experience described.
  2. **Skills Section**: Review the effectiveness and clarity of the skills listed, including whether they align with the job role.
  3. **Education Section**: Comment on the educational background and how it is presented, especially in relation to the job.
  4. **Formatting and Structure**: Evaluate the overall format, including readability, consistency, and professional layout.
  5. **Overall Strengths and Weaknesses**: Give an overall assessment of the resume, highlighting key strengths and areas for improvement.
  `;

  const feedbackInstruction = userQuery
    ? `Focus on the following query from the user: ${userQuery}.`
    : "Provide general constructive feedback on the resume's content, structure, and presentation.";

  return `
  You are a helpful assistant providing constructive feedback on resumes. Your job is to evaluate the following resume text in a professional and constructive tone.
  
  Resume Text:
  ${resumeText}

  Guidelines:
  - Focus on sections like Experience, Skills, Education, Formatting, and overall Resume Quality.
  - Provide feedback on 4-5 sections with 2-3 points for each.
  - Keep your response professional, actionable, and encouraging. Avoid being too harsh.
  - Limit your response to ${wordLimit} words.

  ${sectionStructure}

  ${feedbackInstruction}
  `;
};
const parsePdf = async (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", () => {
      console.error("Error parsing PDF with pdf2json");
      reject(new Error("Failed to parse PDF with pdf2json"));
    });

    pdfParser.on(
      "pdfParser_dataReady",
      (pdfData: {
        Pages: Array<{
          Texts: Array<{ R: Array<{ T: string }> }>;
        }>;
      }) => {
        try {
          const text = pdfData.Pages.map((page) =>
            page.Texts.map((textItem) =>
              decodeURIComponent(textItem.R[0]?.T || "")
            ).join(" ")
          ).join("\n");
          resolve(text);
        } catch (error) {
          console.error("Error extracting text from PDF data", error);
          reject(new Error("Failed to extract text from PDF data"));
        }
      }
    );

    try {
      pdfParser.parseBuffer(buffer);
    } catch (error) {
      console.error("Error parsing buffer", error);
      reject(new Error("Failed to parse PDF buffer"));
    }
  });
};
