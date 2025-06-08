import { NextRequest, NextResponse } from "next/server";
import lookup from "country-code-lookup";

export async function GET(req: NextRequest) {
  try {
    const forwarded = req.headers.get("x-forwarded-for");
    const ip =
      process.env.ENVIRONMENT === "local"
        ? "76.66.89.110"
        : forwarded?.split(",")[0] || "8.8.8.8";
        
    const url = `https://ipinfo.io/${ip}/json`;
    const res = await fetch(url);
    const data = await res.json();

    return NextResponse.json({
      city: data.city,
      region: data.region,
      country: lookup.byFips(data.country).country,
    });
  } catch (err) {
    console.error("Failed to fetch location:", err);
    return NextResponse.json(
      { error: "Location fetch failed" },
      { status: 500 }
    );
  }
}
