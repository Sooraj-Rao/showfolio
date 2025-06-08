import { Analytics } from "@/models/analytics";
import { NextRequest, NextResponse } from "next/server";
import { GetUserId } from "../helper/utils";


export async function GET(req: NextRequest) {
  try {
    const userId = GetUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorzised" }, { status: 403 });
    }
    const analyticsData = await Analytics.find({ user: userId }).select(
      "-resume -user"
    );
    return NextResponse.json({ data: analyticsData });
  } catch  {
    return NextResponse.json(
      { error: "Failed to fetch analytics details" },
      { status: 500 }
    );
  }
}
