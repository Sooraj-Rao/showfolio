import { NextRequest, NextResponse } from "next/server";
import { GetUserId } from "../../helper/utils";
import User from "@/models/user";

export async function POST(req: NextRequest) {
  try {
    const userId = GetUserId(req);
    const { portfolio } = await req.json();
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized..Login again" },
        { status: 401 }
      );
    }
    const res = await User.findByIdAndUpdate(
      userId,
      { portfolioData: JSON.stringify(portfolio) },
      { new: true }
    );
    if (!res) {
      return NextResponse.json(
        { error: "Failed to save portfolio" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Portfolio saved successfully", portfolio: res.portfolio },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const userId =await GetUserId(req);
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized..Login again" },
        { status: 401 }
      );
    }
    const user = await User.findById(userId).select("portfolioData");
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { portfolio: JSON.parse(user.portfolioData || "{}") },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}