import connectDB from "@/lib/db";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const username = url.searchParams.get("username");
    const user = await User.findOne({ portfolio: username }).select(
      "portfolioData templateId portfolioSettings"
    );
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(
      {
        portfolio: JSON.parse(user.portfolioData || "{}"),
        templateId: user.templateId,
        theme: user.portfolioSettings.themeColor,
        themeMode: user.portfolioSettings.theme,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
