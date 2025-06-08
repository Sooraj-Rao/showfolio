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

    const resumeData = await Resume.findOne({ shortUrl });
    if (!resumeData) return NextResponse.json({ success: false });

    const analyticsEntry = await Analytics.create({
      resume: resumeData._id,
      event,
      referrer,
      device:deviceType,
      os: device.platform,
      browser: device.browser,
      city: location.city,
      country: location.country,
      region: location.region,
    });

    console.log("Analytics created:", analyticsEntry);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics API error:", error);
    return NextResponse.json({ success: false });
  }
}
