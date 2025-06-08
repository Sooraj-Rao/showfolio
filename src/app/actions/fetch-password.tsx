"use server";

import connectDB from "@/lib/db";
import Resume from "@/models/resume";

export async function getResumePassword(shortUrl: string) {
  try {
    await connectDB();
    const resume = await Resume.findOne({ shortUrl }, { password: 1 });

    if (!resume) {
      return {
        success: false,
        message: "Resume not found",
        isPasswordProtected: false,
      };
    }
    return {
      success: true,
      password: resume.password,
      message: "Success",
    };
  } catch (error) {
    console.error("Error fetching resume password status:", error);
    return {
      success: false,
      message: "Failed to fetch resume password status",
      isPasswordProtected: false,
    };
  }
}
