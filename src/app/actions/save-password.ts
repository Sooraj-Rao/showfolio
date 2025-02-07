"use server";

import connectDB from "@/lib/db";
import Resume from "@/models/resume";

export async function updateResumePassword(
  shortUrl: string,
  password: string,
  passwordProtected: boolean
) {
  try {
    await connectDB();
    const updatedResume = await Resume.findOneAndUpdate(
      { shortUrl },
      { password, passwordProtected },
      { new: true }
    );

    if (!updatedResume) {
      throw new Error("Resume not found");
    }

    return {
      success: true,
      message: "Password updated successfully",
      result: updatedResume.passwordProtected,
    };
  } catch (error) {
    console.error("Error updating resume password:", error);
    return { success: false, message: "Failed to update password" };
  }
}
