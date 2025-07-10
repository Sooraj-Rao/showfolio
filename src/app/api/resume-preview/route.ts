import connectDB from "@/lib/db";
import Resume from "@/models/resume";
import User from "@/models/user";
import { IUser } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  User.countDocuments();
  const { searchParams } = new URL(req.url);
  const shortUrl = searchParams.get("shortUrl");

  if (!shortUrl) {
    return NextResponse.json(
      { error: "Short URL is required." },
      { status: 400 }
    );
  }

  return getResumePreview(shortUrl);
}

async function getResumePreview(shortUrl: string) {
  try {
    const resume = await Resume.findOne({ shortUrl }).populate({
      path: "user",
      select: "-password",
    });
    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }
    if (!resume.isPublic) {
      return NextResponse.json(
        { error: "Resume is private. You do not have permission to view it." },
        { status: 403 }
      );
    }

    const user = resume.user as IUser;

    if (user.private.resumes) {
      return NextResponse.json(
        { error: "Resume is private. Access denied." },
        { status: 401 }
      );
    }

    if (!user?.isActive) {
      return NextResponse.json(
        { error: "Resume owner account is disabled. Access denied." },
        { status: 403 }
      );
    }

    const portfolioUrl = user.private ? user.private.portfolio : null;

    const result = {
      name: user.name,
      email: user.email,
      fileUrl: `/api/resume-file?resume=${shortUrl}`,
      portfolioUrl: portfolioUrl,
      imageUrl: user.imageUrl || "",
    };

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Error fetching resume:", error);

    if (error instanceof Error) {
      if (error.name === "CastError") {
        return NextResponse.json(
          { error: "Error occurred while fetching the resume." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { error: "An unexpected error occurred while fetching the resume." },
      { status: 500 }
    );
  }
}
