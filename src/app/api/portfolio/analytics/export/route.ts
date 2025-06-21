import { type NextRequest, NextResponse } from "next/server";
import { GetUserId } from "@/app/api/helper/utils"
import connectDB from "@/lib/db"
import PortfolioAnalytics from "@/models/p_analytics"

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const userId = await GetUserId(request);

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "json";
    const days = Number.parseInt(searchParams.get("days") || "30");

    // Date filter
    const dateFilter = new Date();
    dateFilter.setDate(dateFilter.getDate() - days);

    const analytics = await PortfolioAnalytics.find({
      timestamp: { $gte: dateFilter },
    })
      .sort({ timestamp: -1 })
      .select("-ipHash -userAgent");

    if (format === "csv") {
      // Convert to CSV
      const headers = [
        "Date",
        "Time",
        "Event",
        "Page",
        "Section",
        "Time Spent (s)",
        "Scroll Depth (%)",
        "Click Target",
        "Device",
        "OS",
        "Browser",
        "City",
        "Country",
        "Referrer",
      ];

      const csvData = analytics.map((item) => [
        new Date(item.timestamp).toLocaleDateString(),
        new Date(item.timestamp).toLocaleTimeString(),
        item.event,
        item.page,
        item.section || "",
        item.timeSpent || 0,
        item.scrollDepth || 0,
        item.clickTarget || "",
        item.device,
        item.os,
        item.browser,
        item.city,
        item.country,
        item.referrer || "Direct",
      ]);

      const csv = [headers, ...csvData]
        .map((row) => row.map((field) => `"${field}"`).join(","))
        .join("\n");

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="portfolio-analytics-${
            new Date().toISOString().split("T")[0]
          }.csv"`,
        },
      });
    }

    // Return JSON by default
    return NextResponse.json({
      success: true,
      data: analytics,
      exportedAt: new Date().toISOString(),
      totalRecords: analytics.length,
    });
  } catch (error) {
    console.error("Error exporting analytics:", error);
    return NextResponse.json(
      { error: "Failed to export analytics data" },
      { status: 500 }
    );
  }
}
