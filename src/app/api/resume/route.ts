import connectDB from "@/lib/db";
import Resume from "@/models/resume";
import { NextRequest, NextResponse } from "next/server";
import { deleteFileFromStorage, GetUserId } from "../helper/utils";
import User from "@/models/user";
import { v4 as uuidv4 } from "uuid";
import { ResumeNameSplit } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const userId = await GetUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { operation } = body;

    switch (operation) {
      case "create":
        return await createResume(userId, body);
      case "delete":
        return await deleteResumes(userId, body);
      default:
        return NextResponse.json(
          { error: "Invalid operation" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error processing resume operation:", error);
    return NextResponse.json(
      { error: "Failed to process resume operation" },
      { status: 500 }
    );
  }
}

interface CreateResumeBody {
  title: string;
  fileUrl: string;
  fileType: string;
}

async function createResume(userId: string, body: CreateResumeBody) {
  const { title, fileUrl, fileType } = body;
  const shortUrl = await uuidv4();
  const TitleWithoutExtension = await ResumeNameSplit(title);
  const resume = await Resume.create({
    user: userId,
    title: TitleWithoutExtension,
    fileUrl,
    fileType,
    shortUrl,
  });

  await User.findByIdAndUpdate(
    userId,
    {
      $push: { resumes: resume._id },
    },
    { new: true }
  );

  return NextResponse.json(resume);
}

interface DeleteResumeBody {
  selectedResumes: string[];
}

async function deleteResumes(userId: string, body: DeleteResumeBody) {
  const { selectedResumes } = body;

  if (!Array.isArray(selectedResumes) || selectedResumes.length === 0) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const resumes = await Resume.find({
    shortUrl: { $in: selectedResumes },
    user: userId,
  });

  for (const resume of resumes) {
    try {
      await deleteFileFromStorage(resume.fileUrl);
    } catch (error) {
      console.error(
        `Failed to delete file for resume ${resume.shortUrl}:`,
        error
      );
    }
  }

  const deletedResumes = await Resume.deleteMany({
    shortUrl: { $in: selectedResumes },
    user: userId,
  });

  const resumeIdsToDelete = resumes.map((resume) => resume._id);

  await User.findByIdAndUpdate(userId, {
    $pull: { resumes: { $in: resumeIdsToDelete } },
  });

  if (deletedResumes.deletedCount === 0) {
    return NextResponse.json(
      { message: "No resumes were deleted" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: `Successfully deleted ${deletedResumes.deletedCount} resume(s)`,
    deletedCount: deletedResumes.deletedCount,
  });
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const operation = searchParams.get("operation");
    const shortUrl = searchParams.get("shortUrl");

    const userId = await GetUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorzised" }, { status: 403 });
    }

    await connectDB();

    switch (operation) {
      case "getall":
        return await getAllResumes(userId);
      case "getone":
        if (!shortUrl) {
          return NextResponse.json(
            { error: "Short URL is required" },
            { status: 400 }
          );
        }
        return await getOneResume(shortUrl);
      default:
        return NextResponse.json(
          { error: "Invalid operation" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error processing GET request for resumes:", error);
    return NextResponse.json(
      { error: "Failed to process GET request" },
      { status: 500 }
    );
  }
}

async function getAllResumes(userId: string) {
  try {
    const resumes = await Resume.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10);

    return NextResponse.json(resumes);
  } catch (error) {
    console.error("Error fetching all resumes:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}

async function getOneResume(shortUrl: string) {
  try {
    const resume = await Resume.findOne({ shortUrl });

    if (!resume) {
      return NextResponse.json({ error: "Resume not found" }, { status: 404 });
    }

    return NextResponse.json(resume);
  } catch (error) {
    console.error("Error fetching resume:", error);
    return NextResponse.json(
      { error: "Failed to fetch resume" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const userId = await GetUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();
    const { shortUrl, tags, title, isPublic } = body;
    if (!shortUrl) {
      return NextResponse.json({ error: "Invalid Resume ID" }, { status: 400 });
    }

    return await updateTags(userId, shortUrl, tags, title, isPublic);
  } catch (error) {
    console.error("Error processing resume update:", error);
    return NextResponse.json(
      { error: "Failed to process resume update" },
      { status: 500 }
    );
  }
}

async function updateTags(
  userId: string,
  resumeId: string,
  tags: string[],
  title: string,
  isPublic: boolean
) {
  if (!Array.isArray(tags)) {
    return NextResponse.json(
      { error: "Tags must be an array" },
      { status: 400 }
    );
  }

  const resume = await Resume.findOneAndUpdate(
    { shortUrl: resumeId, user: userId },
    { tags, title, isPublic },
    { new: true }
  );

  if (!resume) {
    return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  }

  return NextResponse.json(
    { title: resume.title, tags: resume.tags, isPublic: resume.isPublic },
    { status: 200 }
  );
}
