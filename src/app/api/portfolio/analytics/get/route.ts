/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetUserId } from "@/app/api/helper/utils";
import connectDB from "@/lib/db";
import PortfolioAnalytics from "@/models/p_analytics";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = await GetUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = searchParams.get("page");
    const event = searchParams.get("event");
    const days = Number.parseInt(searchParams.get("days") || "30");
    const limit = Number.parseInt(searchParams.get("limit") || "100");
    const sessionId = searchParams.get("sessionId");

    const query: any = {};

    if (page) query.page = page;
    if (event) query.event = event;
    if (sessionId) query.sessionId = sessionId;

    const dateFilter = new Date();
    dateFilter.setDate(dateFilter.getDate() - days);
    query.timestamp = { $gte: dateFilter };

    const analytics = await PortfolioAnalytics.find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .select("-ipHash"); 
      const totalEvents = analytics.length;
    const uniqueSessions = new Set(analytics.map((item) => item.sessionId))
      .size;

    const eventCounts = analytics.reduce((acc, item) => {
      acc[item.event] = (acc[item.event] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const deviceCounts = analytics.reduce((acc, item) => {
      acc[item.device] = (acc[item.device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const countryCounts = analytics.reduce((acc, item) => {
      acc[item.country] = (acc[item.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sessionTimes = analytics
      .filter((item) => item.event === "time_spent")
      .reduce((acc, item) => {
        acc[item.sessionId] = Math.max(
          acc[item.sessionId] || 0,
          item.timeSpent
        );
        return acc;
      }, {} as Record<string, number>);

    const totalTimeSpent = Object.values(sessionTimes).reduce(
      (sum: number, time: number) => sum + time,
      0
    );
    const avgTimeSpent =
      uniqueSessions > 0
        ? Math.round((totalTimeSpent as number) / uniqueSessions)
        : 0;

    return NextResponse.json({
      success: true,
      data: analytics,
      summary: {
        totalEvents,
        uniqueSessions,
        totalTimeSpent,
        avgTimeSpent,
        eventCounts,
        deviceCounts,
        countryCounts,
      },
    });
  } catch (error) {
    console.error("Error fetching portfolio analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics data" },
      { status: 500 }
    );
  }
}
