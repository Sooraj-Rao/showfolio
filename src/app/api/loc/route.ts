// app/api/location/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0] || "8.8.8.8";
    const res = await fetch(`https://ipapi.co/${ip}/json`);
    const data = await res.json();
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
