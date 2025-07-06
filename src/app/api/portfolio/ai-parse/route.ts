// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { NextRequest, NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import PDFParser from "pdf2json";
// import axios from "axios";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

// export async function POST(req: NextRequest) {
//   try {
//     const formData = await req.formData();
//     const firebaseUrl = formData.get("firebaseUrl") as string | null;
//     const uploadedFile = formData.get("pdf") as File | null;

//     let buffer: Buffer;

//     // Case 1: Firebase URL provided
//     if (firebaseUrl) {
//       const response = await axios.get(firebaseUrl, {
//         responseType: "arraybuffer",
//       });
//       buffer = Buffer.from(response.data);
//     }
//     // Case 2: Direct PDF upload
//     else if (uploadedFile) {
//       const arrayBuffer = await uploadedFile.arrayBuffer();
//       buffer = Buffer.from(arrayBuffer);
//     }
//     // Neither provided
//     else {
//       return NextResponse.json(
//         { error: "No resume file or URL provided" },
//         { status: 400 }
//       );
//     }

//     // Extract text from PDF
//     const resumeText = await parsePdf(buffer);

//     if (!resumeText || resumeText.trim().length === 0) {
//       return NextResponse.json(
//         { error: "Unable to extract readable text from resume" },
//         { status: 400 }
//       );
//     }

//     // Generate prompt
//     const prompt = createStructuredPrompt(resumeText);

//     // Get Gemini output
//     const result = await genAI
//       .getGenerativeModel({ model: "gemini-1.5-flash" })
//       .generateContent(prompt);

//     const responseContent = result.response.text();

//     // Clean markdown-style JSON (```json ... ```)
//     const cleanText = responseContent
//       .replace(/^```json\n/, "")
//       .replace(/```$/, "")
//       .trim();

//     try {
//       const parsedJson = JSON.parse(cleanText);
//       return NextResponse.json({
//         result: parsedJson,
//         success: true,
//       });
//     } catch (e) {
//       console.log("JSON parse error:", e);
//       return NextResponse.json(
//         {
//           error: "Failed to parse JSON from model response",
//           raw: responseContent,
//         },
//         { status: 500 }
//       );
//     }
//   } catch (error) {
//     console.error("Processing error:", error);
//     return NextResponse.json(
//       {
//         error: "Failed to process resume",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 }
//     );
//   }
// }

// const createStructuredPrompt = (resumeText: string): string => {
//   return `
// You are a resume parsing assistant. Analyze the following resume text and extract the information into the specified structured JSON format.

// Resume Text:
// ${resumeText}

// Extract and return ONLY a valid JSON object with the following structure:
// {
//   "name": "",
//   "email": "",
//   "phone": "",
//   "location": "",
//   "socialLinks": ["", ""],
//   "workExperience": [
//     {
//       "company": "",
//       "position": "",
//       "startDate": "",
//       "endDate": "",
//       "description": ""
//     }
//   ],
//   "skills": ["", ""],
//   "education": [
//     {
//       "institution": "",
//       "degree": "",
//       "startDate": "",
//       "endDate": ""
//     }
//   ],
//   "certifications": [
//     {
//       "name": "",
//       "url": "",
//       "dateIssued": "",
//       "issuedBy": ""
//     }
//   ]
// }

// - If a field is not present in the resume, use an empty string or an empty array.
// - Do not include explanations or anything outside the JSON.
// - Return valid JSON only. DO NOT wrap the response in \`\`\`json or any code block.
// `.trim();
// };

// const parsePdf = async (buffer: Buffer): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     const pdfParser = new PDFParser();

//     pdfParser.on("pdfParser_dataError", () => {
//       reject(new Error("Failed to parse PDF"));
//     });

//     pdfParser.on("pdfParser_dataReady", (pdfData) => {
//       try {
//         const text = pdfData.Pages.map((page: any) =>
//           page.Texts.map((textItem: any) =>
//             decodeURIComponent(textItem.R[0]?.T || "")
//           ).join(" ")
//         ).join("\n");
//         resolve(text);
//       } catch (error) {
//         console.log(error);
//         reject(new Error("Error extracting text from PDF data"));
//       }
//     });

//     try {
//       pdfParser.parseBuffer(buffer);
//     } catch (error) {
//       console.log(error);
//       reject(new Error("Failed to parse PDF buffer"));
//     }
//   });
// };

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import PDFParser from "pdf2json";

const GROQ_API_KEY = process.env.GROQ_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const firebaseUrl = formData.get("firebaseUrl") as string | null;
    const uploadedFile = formData.get("pdf") as File | null;

    let buffer: Buffer;

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

    const resumeText = await parsePdf(buffer);

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
      } catch  {
        reject(new Error("Error extracting text from PDF data"));
      }
    });

    try {
      pdfParser.parseBuffer(buffer);
    } catch  {
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
