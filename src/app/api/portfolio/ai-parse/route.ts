/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import PDFParser from "pdf2json";
import axios from "axios";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const firebaseUrl = formData.get("firebaseUrl") as string | null;
    const uploadedFile = formData.get("pdf") as File | null;

    let buffer: Buffer;

    // Case 1: Firebase URL provided
    if (firebaseUrl) {
      const response = await axios.get(firebaseUrl, {
        responseType: "arraybuffer",
      });
      buffer = Buffer.from(response.data);
    }
    // Case 2: Direct PDF upload
    else if (uploadedFile) {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    }
    // Neither provided
    else {
      return NextResponse.json(
        { error: "No resume file or URL provided" },
        { status: 400 }
      );
    }

    // Extract text from PDF
    const resumeText = await parsePdf(buffer);

    if (!resumeText || resumeText.trim().length === 0) {
      return NextResponse.json(
        { error: "Unable to extract readable text from resume" },
        { status: 400 }
      );
    }

    // Generate prompt
    const prompt = createStructuredPrompt(resumeText);

    // Get Gemini output
    const result = await genAI
      .getGenerativeModel({ model: "gemini-1.5-flash" })
      .generateContent(prompt);

    const responseContent = result.response.text();

    // Clean markdown-style JSON (```json ... ```)
    const cleanText = responseContent
      .replace(/^```json\n/, "")
      .replace(/```$/, "")
      .trim();

    try {
      const parsedJson = JSON.parse(cleanText);
      return NextResponse.json({
        result: parsedJson,
        success: true,
      });
    } catch (e) {
      console.log("JSON parse error:", e);
      return NextResponse.json(
        {
          error: "Failed to parse JSON from model response",
          raw: responseContent,
        },
        { status: 500 }
      );
    }
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

const createStructuredPrompt = (resumeText: string): string => {
  return `
You are a resume parsing assistant. Analyze the following resume text and extract the information into the specified structured JSON format.

Resume Text:
${resumeText}

Extract and return ONLY a valid JSON object with the following structure:
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
  ]
}

- If a field is not present in the resume, use an empty string or an empty array.
- Do not include explanations or anything outside the JSON.
- Return valid JSON only. DO NOT wrap the response in \`\`\`json or any code block.
`.trim();
};

const parsePdf = async (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser();

    pdfParser.on("pdfParser_dataError", () => {
      reject(new Error("Failed to parse PDF"));
    });

    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      try {
        const text = pdfData.Pages.map((page: any) =>
          page.Texts.map((textItem: any) =>
            decodeURIComponent(textItem.R[0]?.T || "")
          ).join(" ")
        ).join("\n");
        resolve(text);
      } catch (error) {
        console.log(error);
        reject(new Error("Error extracting text from PDF data"));
      }
    });

    try {
      pdfParser.parseBuffer(buffer);
    } catch (error) {
      console.log(error);
      reject(new Error("Failed to parse PDF buffer"));
    }
  });
};
