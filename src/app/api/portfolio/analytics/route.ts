/* eslint-disable @typescript-eslint/no-explicit-any */
import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import PortfolioAnalytics from "@/models/p_analytics";

function getDeviceType(userAgent: string): "desktop" | "mobile" | "tablet" {
  const ua = userAgent.toLowerCase();
  if (ua.includes("tablet") || ua.includes("ipad")) {
    return "tablet";
  }
  if (
    ua.includes("mobile") ||
    ua.includes("android") ||
    ua.includes("iphone")
  ) {
    return "mobile";
  }
  return "desktop";
}

function getOS(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes("windows")) return "Windows";
  if (ua.includes("mac os")) return "macOS";
  if (ua.includes("linux")) return "Linux";
  if (ua.includes("android")) return "Android";
  if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad"))
    return "iOS";
  return "Unknown";
}

function getBrowser(userAgent: string): string {
  const ua = userAgent.toLowerCase();
  if (ua.includes("chrome") && !ua.includes("edge")) return "Chrome";
  if (ua.includes("firefox")) return "Firefox";
  if (ua.includes("safari") && !ua.includes("chrome")) return "Safari";
  if (ua.includes("edge")) return "Edge";
  if (ua.includes("opera")) return "Opera";
  if (ua.includes("brave")) return "Brave";
  return "Unknown";
}

function hashIP(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(ip + process.env.IP_SALT || "faisuoeliqfhywebwhkjlwnkow98e7gydfhb")
    .digest("hex");
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  return "unknown";
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const userAgent = request.headers.get("user-agent") || "Unknown";
    const clientIP = getClientIP(request);

    const device = getDeviceType(userAgent);
    const os = getOS(userAgent);
    const browser = getBrowser(userAgent);

    const ipHash = hashIP(clientIP);

    const {
      sessionId,
      page,
      event,
      section,
      anchor,
      timeSpent,
      scrollDepth,
      clickTarget,
      screenResolution,
      city,
      region,
      country,
      countryCode,
      referrer,
      user
    } = body;

    if (!sessionId || !page || !event) {
      return NextResponse.json(
        { error: "Missing required fields: sessionId, page, event" },
        { status: 400 }
      );
    }

    const analyticsData = new PortfolioAnalytics({
      user,
      sessionId,
      page,
      section: section || null,
      anchor: anchor || null,
      event,
      timeSpent: timeSpent || 0,
      scrollDepth: scrollDepth || 0,
      clickTarget: clickTarget || null,
      device,
      os,
      browser,
      screenResolution: screenResolution || null,
      city: city || "Unknown",
      region: region || "Unknown",
      country: country || "Unknown",
      countryCode: countryCode || "XX",
      referrer: referrer || null,
      userAgent,
      ipHash,
      timestamp: new Date(),
    });

    await analyticsData.save();

    return NextResponse.json({
      success: true,
      message: "Analytics data saved successfully",
      id: analyticsData._id,
    });
  } catch (error) {
    console.error("Error saving portfolio analytics:", error);
    return NextResponse.json(
      { error: "Failed to save analytics data" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const event = searchParams.get("event");
    const days = Number.parseInt(searchParams.get("days") || "30");
    const limit = Number.parseInt(searchParams.get("limit") || "100");

    const query: any = {};

    if (page) query.page = page;
    if (event) query.event = event;

    const dateFilter = new Date();
    dateFilter.setDate(dateFilter.getDate() - days);
    query.timestamp = { $gte: dateFilter };

    const analytics = await PortfolioAnalytics.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .select("-ipHash -userAgent"); 

    return NextResponse.json({
      success: true,
      data: analytics,
      count: analytics.length,
    });
  } catch (error) {
    console.error("Error fetching portfolio analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
