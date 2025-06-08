/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Download,
  Eye,
  Share2,
  Monitor,
  Globe,
  TrendingUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import axios from "axios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

interface AnalyticsItem {
  _id: string;
  event: string;
  referrer: string | null;
  device: string;
  os: string;
  browser: string;
  city: string;
  country: string;
  region: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/analytics");
      setAnalyticsData(res?.data?.data || []);
    } catch {
      setAnalyticsData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter data based on time range
  const filteredData = useMemo(() => {
    if (!analyticsData.length) return [];

    const now = new Date();
    const filterDate = new Date();

    switch (timeRange) {
      case "24h":
        filterDate.setHours(now.getHours() - 24);
        break;
      case "7d":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "30d":
        filterDate.setDate(now.getDate() - 30);
        break;
      case "90d":
        filterDate.setDate(now.getDate() - 90);
        break;
      default:
        return analyticsData;
    }

    return analyticsData.filter(
      (item) => new Date(item.createdAt) >= filterDate
    );
  }, [analyticsData, timeRange]);

  // Process data for visualizations
  const eventCounts = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const event = item.event.split(":")[0];
      acc[event] = (acc[event] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredData]);

  const deviceCounts = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      acc[item.device] = (acc[item.device] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredData]);

  const osCounts = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      acc[item.os] = (acc[item.os] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredData]);

  const browserCounts = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      acc[item.browser] = (acc[item.browser] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredData]);

  const countryCounts = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      acc[item.country] = (acc[item.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredData]);

  const referrerCounts = useMemo(() => {
    return filteredData.reduce((acc, item) => {
      const referrer = item.referrer || "Direct";
      acc[referrer] = (acc[referrer] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [filteredData]);

  // Create timeline data from actual dates
  const timeSeriesData = useMemo(() => {
    if (!filteredData.length) return [];

    const dailyData = filteredData.reduce((acc, item) => {
      const date = new Date(item.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const event = item.event.split(":")[0];

      if (!acc[date]) {
        acc[date] = { date, view: 0, download: 0, share: 0 };
      }

      acc[date][event] = (acc[date][event] || 0) + 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(dailyData).sort(
      (a: any, b: any) =>
        new Date(a.date + ", 2025").getTime() -
        new Date(b.date + ", 2025").getTime()
    );
  }, [filteredData]);

  // Chart data
  const eventChartData = Object.entries(eventCounts).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
    fill: COLORS[Object.keys(eventCounts).indexOf(key) % COLORS.length],
  }));

  const deviceChartData = Object.entries(deviceCounts).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1),
    value,
    fill: COLORS[Object.keys(deviceCounts).indexOf(key) % COLORS.length],
  }));

  const osChartData = Object.entries(osCounts).map(([key, value]) => ({
    name: key,
    count: value,
  }));

  const browserChartData = Object.entries(browserCounts).map(
    ([key, value]) => ({
      name: key,
      count: value,
    })
  );

  const countryChartData = Object.entries(countryCounts).map(
    ([key, value]) => ({
      name: key === "IN" ? "India" : key,
      count: value,
    })
  );

  const totalViews = eventCounts.view || 0;
  const totalDownloads = eventCounts.download || 0;
  const totalShares = eventCounts.share || 0;
  const totalEvents = filteredData.length;

  // Dynamic insights based on actual data
  const generateInsights = () => {
    const insights = [];

    // Mobile usage insight
    const mobilePercentage = Math.round(
      ((deviceCounts.mobile || 0) / totalEvents) * 100
    );
    if (mobilePercentage > 50) {
      insights.push({
        type: "success",
        title: "Strong Mobile Engagement",
        description: `${mobilePercentage}% of views come from mobile devices. Your resume is mobile-friendly!`,
        color: "green",
      });
    } else if (mobilePercentage > 0) {
      insights.push({
        type: "info",
        title: "Mobile Opportunity",
        description: `${mobilePercentage}% mobile usage. Consider optimizing for mobile experience.`,
        color: "blue",
      });
    }

    // Geographic diversity
    const countryCount = Object.keys(countryCounts).length;
    if (countryCount > 1) {
      insights.push({
        type: "success",
        title: "Global Reach",
        description: `Your resume is being viewed from ${countryCount} different countries, showing international appeal.`,
        color: "blue",
      });
    }

    // Conversion rate insight
    const conversionRate =
      totalViews > 0
        ? Math.round(((totalDownloads + totalShares) / totalViews) * 100)
        : 0;
    if (conversionRate > 30) {
      insights.push({
        type: "success",
        title: "Excellent Conversion",
        description: `${conversionRate}% engagement rate shows strong call-to-action effectiveness.`,
        color: "green",
      });
    } else if (conversionRate > 0) {
      insights.push({
        type: "warning",
        title: "Conversion Opportunity",
        description: `${conversionRate}% engagement rate suggests room for improvement in call-to-action placement.`,
        color: "orange",
      });
    }

    return insights;
  };

  const insights = generateInsights();

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Resume Analytics
          </h2>
          <p className="text-muted-foreground">
            Track your resume performance and engagement metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews}</div>
            <p className="text-xs text-muted-foreground">
              {filteredData.length} total events
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads}</div>
            <p className="text-xs text-muted-foreground">
              {totalViews > 0
                ? Math.round((totalDownloads / totalViews) * 100)
                : 0}
              % of views
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shares</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalShares}</div>
            <p className="text-xs text-muted-foreground">
              {totalViews > 0
                ? Math.round((totalShares / totalViews) * 100)
                : 0}
              % of views
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Engagement Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalViews > 0
                ? Math.round(
                    ((totalDownloads + totalShares) / totalViews) * 100
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-muted-foreground">Actions per view</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Activity Timeline</CardTitle>
                <CardDescription>Resume interactions over time</CardDescription>
              </CardHeader>
              <CardContent>
                {timeSeriesData.length > 0 ? (
                  <ChartContainer
                    config={{
                      view: {
                        label: "Views",
                        color: "hsl(var(--chart-1))",
                      },
                      download: {
                        label: "Downloads",
                        color: "hsl(var(--chart-2))",
                      },
                      share: {
                        label: "Shares",
                        color: "hsl(var(--chart-3))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="view"
                          stroke="var(--color-view)"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="download"
                          stroke="var(--color-download)"
                          strokeWidth={2}
                        />
                        <Line
                          type="monotone"
                          dataKey="share"
                          stroke="var(--color-share)"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No data available for the selected time range
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Event Distribution</CardTitle>
                <CardDescription>
                  Breakdown of resume interactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {eventChartData.length > 0 ? (
                  <ChartContainer
                    config={{
                      value: {
                        label: "Count",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={eventChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {eventChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No events to display
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Device Types
                </CardTitle>
                <CardDescription>How users access your resume</CardDescription>
              </CardHeader>
              <CardContent>
                {deviceChartData.length > 0 ? (
                  <ChartContainer
                    config={{
                      value: {
                        label: "Count",
                      },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {deviceChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    No device data
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operating Systems</CardTitle>
                <CardDescription>
                  OS distribution of your visitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                {osChartData.length > 0 ? (
                  <ChartContainer
                    config={{
                      count: {
                        label: "Count",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={osChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                    No OS data
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Browsers</CardTitle>
                <CardDescription>
                  Browser preferences of visitors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {browserChartData.length > 0 ? (
                    browserChartData.map((browser, index) => (
                      <div
                        key={browser.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <span className="text-sm font-medium">
                            {browser.name}
                          </span>
                        </div>
                        <Badge variant="secondary">{browser.count}</Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground">
                      No browser data
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Geographic Distribution
                </CardTitle>
                <CardDescription>
                  Where your resume is being viewed
                </CardDescription>
              </CardHeader>
              <CardContent>
                {countryChartData.length > 0 ? (
                  <div className="space-y-6">
                    {/* Donut Chart */}
                    <div className="flex justify-center">
                      <ChartContainer
                        config={{
                          count: {
                            label: "Views",
                          },
                        }}
                        className="h-[200px] w-[200px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={countryChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={2}
                              dataKey="count"
                            >
                              {countryChartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                            <ChartTooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-background border rounded-lg p-2 shadow-md">
                                      <p className="font-medium">{data.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {data.count} views (
                                        {Math.round(
                                          (data.count / totalEvents) * 100
                                        )}
                                        %)
                                      </p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>

                    {/* Country List with Progress Bars */}
                    <div className="space-y-3">
                      {countryChartData
                        .sort((a, b) => b.count - a.count)
                        .map((country, index) => {
                          const percentage = Math.round(
                            (country.count / totalEvents) * 100
                          );
                          const getCountryFlag = (countryName: string) => {
                            const flags: Record<string, string> = {
                              Canada: "🇨🇦",
                              India: "🇮🇳",
                              USA: "🇺🇸",
                              UK: "🇬🇧",
                              Australia: "🇦🇺",
                              Germany: "🇩🇪",
                              France: "🇫🇷",
                              Japan: "🇯🇵",
                              Brazil: "🇧🇷",
                              China: "🇨🇳",
                            };
                            return flags[countryName] || "🌍";
                          };

                          return (
                            <div key={country.name} className="space-y-2">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">
                                    {getCountryFlag(country.name)}
                                  </span>
                                  <span className="font-medium">
                                    {country.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-muted-foreground">
                                    {percentage}%
                                  </span>
                                  <Badge variant="outline">
                                    {country.count}
                                  </Badge>
                                </div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full transition-all duration-500 ease-out"
                                  style={{
                                    width: `${percentage}%`,
                                    backgroundColor:
                                      COLORS[index % COLORS.length],
                                  }}
                                />
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {/* Summary Stats */}
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            {Object.keys(countryCounts).length}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Countries
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-primary">
                            {totalEvents}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Total Views
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No geographic data
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Locations</CardTitle>
                <CardDescription>Cities with most engagement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredData.length > 0 ? (
                    Object.entries(
                      filteredData.reduce((acc, item) => {
                        const location = `${item.city}, ${
                          item.country === "IN" ? "India" : item.country
                        }`;
                        acc[location] = (acc[location] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    )
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 5)
                      .map(([location, count], index) => (
                        <div
                          key={location}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-medium">
                              {index + 1}
                            </div>
                            <span className="font-medium">{location}</span>
                          </div>
                          <Badge variant="outline">{count} views</Badge>
                        </div>
                      ))
                  ) : (
                    <div className="text-center text-muted-foreground">
                      No location data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>How users found your resume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.keys(referrerCounts).length > 0 ? (
                    Object.entries(referrerCounts)
                      .sort(([, a], [, b]) => b - a)
                      .map(([referrer, count]) => {
                        const percentage = Math.round(
                          (count / totalEvents) * 100
                        );
                        const getSourceIcon = (source: string) => {
                          const lowerSource = source.toLowerCase();
                          if (source === "Direct") return "🔗";
                          if (lowerSource.includes("instagram")) return "📷";
                          if (lowerSource.includes("linkedin")) return "💼";
                          if (
                            lowerSource.includes("twitter") ||
                            lowerSource.includes("x.com")
                          )
                            return "🐦";
                          if (lowerSource.includes("facebook")) return "📘";
                          if (lowerSource.includes("google")) return "🔍";
                          if (lowerSource.includes("github")) return "⚡";
                          if (
                            lowerSource.includes("email") ||
                            lowerSource.includes("mail")
                          )
                            return "📧";
                          if (lowerSource.includes("whatsapp")) return "💬";
                          if (lowerSource.includes("telegram")) return "✈️";
                          return "🌐";
                        };

                        const getSourceLabel = (source: string) => {
                          if (source === "Direct") return "Direct Access";
                          if (source.includes("instagram.com"))
                            return "Instagram";
                          if (source.includes("linkedin.com"))
                            return "LinkedIn";
                          if (
                            source.includes("twitter.com") ||
                            source.includes("x.com")
                          )
                            return "Twitter/X";
                          if (source.includes("facebook.com"))
                            return "Facebook";
                          if (source.includes("google.com"))
                            return "Google Search";
                          if (source.includes("github.com")) return "GitHub";
                          return source.length > 30
                            ? source.substring(0, 30) + "..."
                            : source;
                        };

                        return (
                          <div key={referrer} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-lg">
                                  {getSourceIcon(referrer)}
                                </span>
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">
                                    {getSourceLabel(referrer)}
                                  </span>
                                  {referrer !== "Direct" &&
                                    referrer.length > 30 && (
                                      <span
                                        className="text-xs text-muted-foreground truncate max-w-[150px]"
                                        title={referrer}
                                      >
                                        {referrer}
                                      </span>
                                    )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  {percentage}%
                                </span>
                                <Badge variant="outline">{count}</Badge>
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div
                                className="h-1.5 rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-blue-500 to-purple-500"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <div className="text-4xl mb-2">🔗</div>
                      <div className="text-sm">No referrer data available</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        All traffic appears to be direct
                      </div>
                    </div>
                  )}
                </div>

                {/* Traffic Source Summary */}
                {Object.keys(referrerCounts).length > 0 && (
                  <div className="pt-4 border-t mt-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-xl font-bold text-primary">
                          {Object.keys(referrerCounts).length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Sources
                        </div>
                      </div>
                      <div>
                        <div className="text-xl font-bold text-primary">
                          {Math.round(
                            ((referrerCounts["Direct"] || 0) / totalEvents) *
                              100
                          )}
                          %
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Direct Traffic
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Conversion Funnel</CardTitle>
                <CardDescription>
                  User journey from view to action
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-blue-600" />
                      <span className="font-medium">Views</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {totalViews}
                      </div>
                      <div className="text-sm text-muted-foreground">100%</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Download className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Downloads</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-600">
                        {totalDownloads}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {totalViews > 0
                          ? Math.round((totalDownloads / totalViews) * 100)
                          : 0}
                        %
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Share2 className="h-5 w-5 text-orange-600" />
                      <span className="font-medium">Shares</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-600">
                        {totalShares}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {totalViews > 0
                          ? Math.round((totalShares / totalViews) * 100)
                          : 0}
                        %
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
                <CardDescription>Data-driven recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {insights.length > 0 ? (
                    insights.map((insight, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 bg-${insight.color}-500`}
                          />
                          <div>
                            <h4
                              className={`font-medium text-${insight.color}-700`}
                            >
                              {insight.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {insight.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground">
                      Not enough data for insights yet. Keep sharing your
                      resume!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
