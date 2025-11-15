/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import PDFParser from "pdf2json";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function GET() {
  return NextResponse.json('hello')
}

export async function POST(req: NextRequest) {

  try {
    const formData = await req.formData();
    const firebaseUrl = formData.get("firebaseUrl") as string | null;
    const uploadedFile = formData.get("pdf") as File | null;

    let buffer: Buffer;

    try {
      
      if (firebaseUrl) {
        const response = await axios.get(firebaseUrl, {
          responseType: "arraybuffer",
        });
        buffer = Buffer.from(response.data);
      } else if (uploadedFile) {
        const arrayBuffer = await uploadedFile.arrayBuffer();
        buffer = Buffer.from(arrayBuffer);
      } else {
        return NextResponse.json(
          { error: "No resume file or URL provided" },
          { status: 400 }
        );
      }
    } catch (err) {
      console.log(err)
    }

    const resumeText = await parsePdf(buffer);
console.log(resumeText)

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: "Unable to extract readable text from resume" },
        { status: 400 }
      );
    }

    const prompt = createStructuredPrompt(resumeText);
    
    const llmResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-4-scout-17b-16e-instruct",
          messages: [
            {
              role: "system",
              content:
                "You are a resume parsing assistant. Return valid JSON only.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.3,
        }),
      }
    );

    const llmResult = await llmResponse.json();
    const responseContent = llmResult.choices?.[0]?.message?.content || "";
    let parsedJson: any = null;
    let rawContent = responseContent.trim();

    rawContent = rawContent
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/, "")
      .trim();

    try {
      parsedJson = JSON.parse(rawContent);
    } catch (err) {
      console.log(err)
      return NextResponse.json(
        {
          error: "Failed to parse LLM JSON response",
          raw: rawContent,
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ result: parsedJson, success: true });
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

const createStructuredPrompt = (resumeText: string): string => {
  return `
Analyze the following resume and extract the key information in this JSON format:

{
  "name": "",
  "email": "",
  "phone": "",
  "location": "",
  "socialLinks": ["", ""],
  "workExperience": [
    {
      "company": "",
      "position": "",
      "startDate": "",
      "endDate": "",
      "description": ""
    }
  ],
  "skills": ["", ""],
  "education": [
    {
      "institution": "",
      "degree": "",
      "startDate": "",
      "endDate": ""
    }
  ],
  "certifications": [
    {
      "name": "",
      "url": "",
      "dateIssued": "",
      "issuedBy": ""
    }
  ],
  "projects": [
    {
      "name": "",
      "description": "",
      "technnology": "",
      "link": "",
      imageUrl:""
    }
  ],
  achievements: [
    {
  description: "",
  link: "",
}]
}

Resume Text:
${resumeText}

- Return only valid JSON.
- If data is missing, return empty strings or arrays.
- Do not include code blocks or markdown.
`.trim();
};
