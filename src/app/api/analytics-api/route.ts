import connectDB from "@/lib/db";
import { Analytics } from "@/models/analytics";
import Resume from "@/models/resume";
import { NextRequest, NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const { resumeId: shortUrl, event, data } = await req.json();

    const referrer = req.headers.get("referer") || "direct";
    const userAgent = req.headers.get("user-agent") || "";
    const { location, device } = data;
    const parser = new UAParser();
    parser.setUA(userAgent);
    const deviceType = parser.getDevice()?.type || "desktop";

    const resumeData = await Resume.findOne({ shortUrl }).populate("user");
    if (!resumeData) return NextResponse.json({ success: false });

    await Analytics.create({
      user: resumeData.user,
      resume: resumeData._id,
      event,
      referrer: referrer
        ? new URLSearchParams(referrer.split("?")[1]).get("ref")
        : null,
      device: deviceType,
      os: device.platform == "Win32" ? "Windows" : device.platform,
      browser: device.browser,
      city: location.city,
      country: location.country,
      region: location.region,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false });
  }
}
