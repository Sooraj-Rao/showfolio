import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0] || "8.8.8.8";
    const url = `https://ipapi.co/${ip}/json`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(ip);
    console.log(url);
    console.log(data);
    return NextResponse.json(data);
  } catch (err) {
    console.error("Failed to fetch location:", err);
    return NextResponse.json(
      { error: "Location fetch failed" },
      { status: 500 }
    );
  }
}
