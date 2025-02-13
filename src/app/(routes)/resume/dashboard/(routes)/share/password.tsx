"use client";

import { getResumePassword } from "@/app/actions/fetch-password";

export async function checkResumePasswordProtection(shortUrl: string) {
  try {
    const result = await getResumePassword(shortUrl);
    return result;
  } catch (error) {
    console.error("Error checking resume password protection:", error);
    return {
      success: false,
      message: "Failed to check password protection",
      isPasswordProtected: false,
    };
  }
}
