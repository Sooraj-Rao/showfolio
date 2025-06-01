import Resume from "@/models/resume";
import { IUser } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shortUrl = searchParams.get("resume");
  const preview = searchParams.get("preview");
  const { fileUrl, title, user } = await Resume.findOne({ shortUrl })
    .select("fileUrl title")
    .populate("user");

  if (!fileUrl)
    return new NextResponse("Internal Server Error", { status: 500 });

  try {
    const res = await fetch(fileUrl);

    if (!res.ok) {
      return new NextResponse("Failed to fetch PDF", { status: 500 });
    }
    const buffer = await res.arrayBuffer();
    const filename = preview ? `${(user as IUser)?.name}_Resume` : title;
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}.pdf"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
