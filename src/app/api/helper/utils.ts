import { NextRequest, NextResponse } from "next/server";
import { ref, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";

export const setAuthCookie = (response: NextResponse, token: string) => {
  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 86400, // 1d
    path: "/",
  });
};

export const GetUserId = (req: NextRequest) => {
  return req.headers.get("x-user-id");
};

export async function deleteFileFromStorage(fileUrl: string) {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting file from Firebase Storage:", error);
    throw error;
  }
}
