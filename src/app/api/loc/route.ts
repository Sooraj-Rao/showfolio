// app/api/location/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Extract user's IP from headers
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0] || "8.8.8.8"; // fallback IP (Google DNS for testing)

    const res = await fetch(`https://ipinfo.io/${ip}/json`);
    const data = await res.json();

    return NextResponse.json({ ip, ...data });
  } catch (err) {
    console.error("Failed to fetch location:", err);
    return NextResponse.json({ error: "Location fetch failed" }, { status: 500 });
  }
}
