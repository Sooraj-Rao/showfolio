import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import connectDB from "@/lib/db";
import PortfolioAnalytics from "@/models/p_analytics";

function hashIP(ip: string): string {
  return crypto
    .createHash("sha256")
    .update(ip + process.env.IP_SALT || "default_salt")
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
    const {
      sessionId,
      page,
      timeSpent,
      scrollDepth,
      city,
      region,
      country,
      countryCode,
    } = body;

    if (!sessionId || !page) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const clientIP = getClientIP(request);
    const ipHash = hashIP(clientIP);

    // Update or create time_spent event for this session and page
    await PortfolioAnalytics.findOneAndUpdate(
      {
        sessionId,
        page,
        event: "time_spent",
        ipHash,
      },
      {
        $set: {
          timeSpent: timeSpent || 0,
          scrollDepth: scrollDepth || 0,
          city: city || "Unknown",
          region: region || "Unknown",
          country: country || "Unknown",
          countryCode: countryCode || "XX",
          timestamp: new Date(),
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Heartbeat updated successfully",
    });
  } catch (error) {
    console.error("Error updating heartbeat:", error);
    return NextResponse.json(
      { error: "Failed to update heartbeat" },
      { status: 500 }
    );
  }
}
