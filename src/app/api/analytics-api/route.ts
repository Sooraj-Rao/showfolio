import connectDB from "@/lib/db";
import { Analytics } from "@/models/analytics";
import Resume from "@/models/resume";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { resumeId: shortUrl, event, data } = await req.json();

    const referrerHeader = req.headers.get("referer") || "direct";
    const userAgent = req.headers.get("user-agent") || "";
    const { location, device } = data || {};

    const parser = new UAParser();
    parser.setUA(userAgent);
    const deviceType = parser.getDevice()?.type || "desktop";

    let ref = null;
    try {
      const url = new URL(referrerHeader);
      ref = url.searchParams.get("ref");
    } catch {
      ref = null;
    }
    if (ref == "demo") {
      return NextResponse.json({ success: true, demo: true });
    }
    const isView = event === "view:resume";
    const isDownload = event === "download:resume";
    const isShare = event === "share:resume";

    const incrementField = isView
      ? { "analytics.views": 1 }
      : isDownload
      ? { "analytics.downloads": 1 }
      : isShare
      ? { "analytics.shares": 1 }
      : null;

    let resumeData;
    if (incrementField) {
      resumeData = await Resume.findOneAndUpdate(
        { shortUrl },
        { $inc: incrementField },
        { new: true }
      );
    } else {
      resumeData = await Resume.findOne({ shortUrl });
    }

    if (!resumeData) {
      return NextResponse.json(
        { success: false, message: "Resume not found" },
        { status: 404 }
      );
    }

    await Analytics.create({
      user: resumeData.user,
      resume: resumeData._id,
      event,
      referrer: ref,
      device: deviceType,
      os:
        device?.platform === "Win32"
          ? "Windows"
          : device?.platform || "Unknown",
      browser: device?.browser || "Unknown",
      city: location?.city || "Unknown",
      country: location?.country || "Unknown",
      countryCode: location?.countryCode || "Unknown",
      region: location?.region || "Unknown",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics POST error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
