import { Analytics } from "@/models/analytics";
import { NextRequest, NextResponse } from "next/server";
import { IResume } from "@/models/resume";
import { GetUserId } from "../../helper/utils";

export async function GET(req: NextRequest) {
  try {
    const userId = GetUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorzised" }, { status: 403 });
    }
    const analyticsData = await Analytics.find({ user: userId })
      .populate<{ resume: IResume }>("resume")
      .select("-user");
    const newData = analyticsData.map((item) => {
      return {
        event: item.event,
        referrer: item.referrer,
        device: item.device,
        os: item.os,
        browser: item.browser,
        city: item.city,
        country: item.country,
        countryCode: item.countryCode,
        region: item.region,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        resumeName: item.resume.title,
        resumeShortUrl: item.resume.shortUrl,
      };
    });

    return NextResponse.json({ data: newData });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch analytics details" },
      { status: 500 }
    );
  }
}
