/* eslint-disable @typescript-eslint/no-unused-vars */
import connectDB from "@/lib/db";
import Resume from "@/models/resume";
import { IUser } from "@/models/user";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shortUrl = searchParams.get("resume");
  const preview = searchParams.get("preview");
  const firstView = searchParams.get("firstview") == "true";

  if (!shortUrl) {
    return new NextResponse("Resume not found", { status: 404 });
  }
  await connectDB();

  let fileUrl: string, title: string, isPrivate: boolean, user;
  try {
    if (firstView) {
      const updatedResume = await Resume.findOneAndUpdate(
        { shortUrl },
        { $inc: { "analytics.views": 1 } },
        { new: true }
      )
        .select("fileUrl title user")
        .populate("user");
      const userData = updatedResume.user as IUser;
      if (updatedResume) {
        isPrivate = userData.private.profile || userData.private.resumes;
        fileUrl = updatedResume.fileUrl;
        title = updatedResume.title;
        user = updatedResume.user;
      }
    } else {
      const resume = await Resume.findOne({ shortUrl })
        .select("fileUrl title user analytics")
        .populate("user");
      const userData = resume.user as IUser;
      if (resume) {
        isPrivate = userData.private.profile || userData.private.resumes;
        fileUrl = resume.fileUrl;
        title = resume.title;
        user = resume.user;
      }
    }

    if (!fileUrl) {
      return new NextResponse("Resume not found or file URL is missing", {
        status: 404,
      });
    }
    if (isPrivate) {
      return new NextResponse("Resume is private. Access denied", {
        status: 401,
      });
    }

    const res = await fetch(fileUrl);
    if (!res.ok) {
      return new NextResponse("Failed to fetch PDF", { status: 404 });
    }

    const buffer = await res.arrayBuffer();
    const filename = preview ? `${(user as IUser)?.name}_Resume` : title;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error fetching or updating resume:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
