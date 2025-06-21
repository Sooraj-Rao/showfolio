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
  FileText,
  Plus,
  BarChart3,
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
import { Button } from "@/components/ui/button";
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
  Line,
  AreaChart,
  Area,
} from "recharts";
import axios from "axios";
import useResumes from "@/app/hooks/get-resumes";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import AnalyticsDesc, { AnalyticsItem } from "./desc";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884D8",
  "#82ca9d",
  "#ffc658",
];



interface Resume {
  _id: string;
  title: string;
  fileUrl: string;
  tags: string[];
  shortUrl: string;
  isPublic: boolean;
  passwordProtected: boolean;
  createdAt: string;
  updatedAt: string;
}

const generateDummyData = () => {
  const events = ["view", "download", "share"];
  const devices = ["desktop", "mobile", "tablet"];
  const browsers = ["Chrome", "Safari", "Firefox", "Edge"];
  const countries = ["USA", "Canada", "UK", "India", "Germany"];
  const cities = ["New York", "Toronto", "London", "Mumbai", "Berlin"];
  const referrers = [
    null,
    "https://linkedin.com",
    "https://twitter.com",
    "https://github.com",
    "https://google.com",
  ];

  const data = [];
  const now = new Date();

  for (let i = 0; i < 50; i++) {
    const randomDaysAgo = Math.floor(Math.random() * 7);
    const randomHours = Math.floor(Math.random() * 24);
    const eventDate = new Date(now);
    eventDate.setDate(eventDate.getDate() - randomDaysAgo);
    eventDate.setHours(randomHours);

    data.push({
      _id: `dummy${i}`,
      resume: "dummy-resume",
      event: `${events[Math.floor(Math.random() * events.length)]}:resume`,
      referrer: referrers[Math.floor(Math.random() * referrers.length)],
      device: devices[Math.floor(Math.random() * devices.length)],
      os:
        Math.random() > 0.5 ? "Windows" : Math.random() > 0.5 ? "macOS" : "iOS",
      browser: browsers[Math.floor(Math.random() * browsers.length)],
      city: cities[Math.floor(Math.random() * cities.length)],
      country: countries[Math.floor(Math.random() * countries.length)],
      region: "Region",
      createdAt: eventDate.toISOString(),
      updatedAt: eventDate.toISOString(),
      __v: 0,
    });
  }

  return data.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
};

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedResumeId, setSelectedResumeId] = useState("all");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { resumes } = useResumes();
  const params = useSearchParams();

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
    if (analyticsData.length == 0) fetchData();
    if (params.get("resume")) {
      handleResumeChange(params.get("resume"));
    }
  }, [params]);

  const handleResumeChange = (resumeId: string) => {
    setSelectedResumeId(resumeId);
  };

 
  const resumeAnalyticsData = useMemo(() => {
    if (selectedResumeId === "all") return analyticsData;
    return analyticsData.filter((item) => item.resumeShortUrl === selectedResumeId);
  }, [analyticsData, selectedResumeId]);
  const isEmptyState = !loading && resumes.length === 0;
  const dataToUse = isEmptyState ? generateDummyData() : resumeAnalyticsData;

  const filteredData = useMemo(() => {
    if (!dataToUse.length) return [];

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
        return dataToUse;
    }

    return dataToUse.filter((item) => new Date(item.createdAt) >= filterDate);
  }, [dataToUse, timeRange]);

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

  const timeSeriesData = useMemo(() => {
    if (!filteredData.length) return [];

    const dailyData = filteredData.reduce((acc, item) => {
      const date = new Date(item.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      const event = item.event.split(":")[0];

      if (!acc[date]) {
        acc[date] = { date, view: 0, download: 0, share: 0, total: 0 };
      }

      acc[date][event] = (acc[date][event] || 0) + 1;
      acc[date].total += 1;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(dailyData).sort(
      (a: any, b: any) =>
        new Date(a.date + ", 2025").getTime() -
        new Date(b.date + ", 2025").getTime()
    );
  }, [filteredData]);

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
      count: value as number,
    })
  );

  const countryChartData = Object.entries(countryCounts).map(
    ([key, value]) => ({
      name: key === "IN" ? "India" : key,
      count: value as number,
    })
  );

  const totalViews = eventCounts.view || 0;
  const totalDownloads = eventCounts.download || 0;
  const totalShares = eventCounts.share || 0;
  const totalContact = eventCounts.contact || 0;
  const totalEvents = filteredData.length;

  const generateInsights = () => {
    const insights = [];

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

    const countryCount = Object.keys(countryCounts).length;
    if (countryCount > 1) {
      insights.push({
        type: "success",
        title: "Global Reach",
        description: `Your resume is being viewed from ${countryCount} different countries, showing international appeal.`,
        color: "blue",
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

  if (isEmptyState) {
    return (
      <div className="relative flex-1 space-y-4 p-4 md:p-8 pt-6 max-w-7xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground text-sm">
            Detailed analytics for your resumes
          </p>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
          <div className="text-center space-y-4 p-8 mt-40 backdrop-blur-md max-w-md mx-4">
            <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">No Resumes Yet</h3>
            <p className="text-muted-foreground text-sm">
              Upload your first resume to start tracking analytics and see
              insights.
            </p>
            <Link href={"/resume/upload"}>
              <Button className="w-full mt-2">
                <Plus className="w-4 h-4 mr-2" />
                Upload Resume
              </Button>
            </Link>
          </div>
        </div>

        {/* Preview content with dummy data */}
        <div className="opacity-50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end space-y-2 sm:space-y-0 mb-6">
            <div className="flex items-center space-x-2">
              <Select value={timeRange} onValueChange={setTimeRange} disabled>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Views
                </CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">5 total events</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Downloads</CardTitle>
                <Download className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-muted-foreground">18% of views</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shares</CardTitle>
                <Share2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">6% of views</p>
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
                <div className="text-2xl font-bold">24%</div>
                <p className="text-xs text-muted-foreground">
                  Actions per view
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const selectedResume = resumes?.find(
    (r: Resume) => r.shortUrl === selectedResumeId
  );



  return (
    <div className="flex-1 w-full max-w-7xl mx-auto  space-y-6 overflow-x-hidden">
      <div className="flex flex-col space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Resume Analytics
          </h2>
          <p className="text-muted-foreground text-sm  mt-1">
            {selectedResumeId === "all"
              ? "Combined analytics for all resumes"
              : selectedResume
              ? `Analytics for "${selectedResume.title}"`
              : "Track your resume performance"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-1">
          <Select value={selectedResumeId} onValueChange={handleResumeChange}>
            <SelectTrigger className="w-full sm:w-[240px]">
              <SelectValue placeholder="Select resume">
                {selectedResumeId === "all" ? (
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 shrink-0" />
                    <span className="truncate">All Resumes</span>
                  </div>
                ) : selectedResume ? (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="truncate">{selectedResume.title}</span>
                  </div>
                ) : (
                  "Select resume"
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>All Resumes</span>
                </div>
              </SelectItem>
              {resumes?.map((resume) => (
                <SelectItem key={resume._id} value={resume.shortUrl}>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span className="truncate max-w-[200px]">
                      {resume.title}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-full p-3 sm:w-[180px]">
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

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">
              Total Views
            </CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{totalViews}</div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">
                {filteredData.length} total events
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">
              Downloads
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">
              {totalDownloads}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">
                {totalViews > 0
                  ? Math.round((totalDownloads / totalViews) * 100)
                  : 0}
                % of views
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">
              Shares
            </CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{totalShares}</div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">
                {totalViews > 0
                  ? Math.round((totalShares / totalViews) * 100)
                  : 0}
                % of views
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium truncate">
              Contacted
            </CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground shrink-0" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{totalContact}</div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">
                {totalViews > 0
                  ? Math.round((totalContact / totalViews) * 100)
                  : 0}
                % of views
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <div className="w-full overflow-x-auto">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-20 sm:h-9  min-w-[320px]">
            <TabsTrigger value="overview" className="text-xs  sm:text-sm">
              Overview
            </TabsTrigger>
            <TabsTrigger value="devices" className="text-xs sm:text-sm">
              Devices
            </TabsTrigger>
            <TabsTrigger value="geography" className="text-xs sm:text-sm">
              Geography
            </TabsTrigger>
            <TabsTrigger value="desc" className="text-xs sm:text-sm">
              Event Insights
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Activity Timeline
                </CardTitle>
                <CardDescription className="text-sm">
                  Resume interactions over time
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-6 overflow-hidden ">
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
                    className="h-[200px] w-[250px] md:w-[300px] lg:md:w-[400px] xl:w-full sm:h-[250px] lg:h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart
                        data={timeSeriesData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorView"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="var(--color-view)"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="var(--color-view)"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient
                            id="colorDownload"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="var(--color-download)"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="var(--color-download)"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="date"
                          fontSize={10}
                          tick={{ fontSize: 10 }}
                          interval="preserveStartEnd"
                        />
                        <YAxis fontSize={10} tick={{ fontSize: 10 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="view"
                          stackId="1"
                          stroke="var(--color-view)"
                          fill="url(#colorView)"
                        />
                        <Area
                          type="monotone"
                          dataKey="download"
                          stackId="1"
                          stroke="var(--color-download)"
                          fill="url(#colorDownload)"
                        />
                        <Line
                          type="monotone"
                          dataKey="share"
                          stroke="var(--color-share)"
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[200px] sm:h-[250px] lg:h-[300px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <div className="text-sm sm:text-base">
                        No data available for the selected time range
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">
                  Event Distribution
                </CardTitle>
                <CardDescription className="text-sm">
                  Breakdown of resume interactions
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                {eventChartData.length > 0 ? (
                  <ChartContainer
                    config={{
                      value: {
                        label: "Count",
                      },
                    }}
                    className="h-full w-full sm:h-[250px] lg:h-[300px]"
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
                          outerRadius="70%"
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
                  <div className="h-full sm:h-[250px] lg:h-[300px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <div className="text-sm sm:text-base">
                        No events to display
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Monitor className="h-5 w-5 shrink-0" />
                  <span className="truncate">Device Types</span>
                </CardTitle>
                <CardDescription className="text-sm">
                  How users access your resume
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                {deviceChartData.length > 0 ? (
                  <ChartContainer
                    config={{
                      value: {
                        label: "Count",
                      },
                    }}
                    className="h-[180px] sm:h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={deviceChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius="70%"
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
                  <div className="h-[180px] sm:h-[200px] flex items-center justify-center text-muted-foreground">
                    <div className="text-sm">No device data</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Operating Systems</CardTitle>
                <CardDescription className="text-sm">
                  OS distribution of your visitors
                </CardDescription>
              </CardHeader>
              <CardContent className="p-2 sm:p-6">
                {osChartData.length > 0 ? (
                  <ChartContainer
                    config={{
                      count: {
                        label: "Count",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-[180px] sm:h-[200px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={osChartData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          fontSize={10}
                          tick={{ fontSize: 10 }}
                          interval={0}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis fontSize={10} tick={{ fontSize: 10 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                          dataKey="count"
                          fill="var(--color-count)"
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[180px] sm:h-[200px] flex items-center justify-center text-muted-foreground">
                    <div className="text-sm">No OS data</div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Browsers</CardTitle>
                <CardDescription className="text-sm">
                  Browser preferences of visitors
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 max-h-[180px] sm:max-h-[200px] overflow-y-auto">
                  {browserChartData.length > 0 ? (
                    browserChartData.map((browser, index) => (
                      <div
                        key={browser.name}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <span className="text-sm font-medium truncate">
                            {browser.name}
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-xs shrink-0 ml-2"
                        >
                          {browser.count}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <div className="text-sm">No browser data</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="h-5 w-5 shrink-0" />
                  <span className="truncate">Geographic Distribution</span>
                </CardTitle>
                <CardDescription className="text-sm">
                  Where your resume is being viewed
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
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
                        className="h-[150px] w-[150px] sm:h-[180px] sm:w-[180px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={countryChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius="50%"
                              outerRadius="80%"
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
                                      <p className="font-medium text-sm">
                                        {data.name}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
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

                    {/* Summary Stats */}
                    <div className="pt-4 border-t">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-xl sm:text-2xl font-bold text-primary">
                            {Object.keys(countryCounts).length}
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            Countries
                          </div>
                        </div>
                        <div>
                          <div className="text-xl sm:text-2xl font-bold text-primary">
                            {totalEvents}
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground">
                            Total Views
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <div className="text-sm">No geographic data</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Top Locations</CardTitle>
                <CardDescription className="text-sm">
                  Cities with most engagement
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                  {filteredData.length > 0 ? (
                    Object.entries(
                      filteredData.reduce((acc, item) => {
                        const location = `${item.city}, ${item.country}`;
                        acc[location] = (acc[location] || 0) + 1;
                        return acc;
                      }, {} as Record<string, number>)
                    )
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .slice(0, 8)
                      .map(([location, count], index) => (
                        <div
                          key={location}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-xs font-medium shrink-0">
                              {index + 1}
                            </div>
                            <span className="font-medium text-sm truncate">
                              {location}
                            </span>
                          </div>
                          <Badge
                            variant="outline"
                            className="text-xs shrink-0 ml-2"
                          >
                            {count as number} events
                          </Badge>
                        </div>
                      ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <div className="text-sm">No location data available</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg">Traffic Sources</CardTitle>
                <CardDescription className="text-sm">
                  How users found your resume
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                  {Object.keys(referrerCounts).length > 0 ? (
                    Object.entries(referrerCounts)
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .map(([referrer, count]) => {
                        const percentage = Math.round(
                          ((count as number) / totalEvents) * 100
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
                          return source.length > 15
                            ? source.substring(0, 15) + "..."
                            : source;
                        };

                        return (
                          <div key={referrer} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <span className="text-lg shrink-0">
                                  {getSourceIcon(referrer)}
                                </span>
                                <div className="flex flex-col min-w-0 flex-1">
                                  <span className="font-medium text-xs sm:text-sm truncate">
                                    {getSourceLabel(referrer)}
                                  </span>
                                  {referrer !== "Direct" &&
                                    referrer.length > 15 && (
                                      <span
                                        className="text-xs text-muted-foreground truncate"
                                        title={referrer}
                                      >
                                        {referrer}
                                      </span>
                                    )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-muted-foreground">
                                  {percentage}%
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {count as number}
                                </Badge>
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
                        <div className="text-lg sm:text-xl font-bold text-primary">
                          {Object.keys(referrerCounts).length}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Sources
                        </div>
                      </div>
                      <div>
                        <div className="text-lg sm:text-xl font-bold text-primary">
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

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Conversion Funnel</CardTitle>
                <CardDescription className="text-sm">
                  User journey from view to action
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4  rounded-lg">
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-blue-600 shrink-0" />
                      <span className="font-medium text-sm sm:text-base">
                        Views
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg sm:text-2xl font-bold text-blue-600">
                        {totalViews}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        100%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Download className="h-5 w-5 text-green-600 shrink-0" />
                      <span className="font-medium text-sm sm:text-base">
                        Downloads
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg sm:text-2xl font-bold text-green-600">
                        {totalDownloads}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        {totalViews > 0
                          ? Math.round((totalDownloads / totalViews) * 100)
                          : 0}
                        %
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4  rounded-lg">
                    <div className="flex items-center gap-3">
                      <Share2 className="h-5 w-5 text-orange-600 shrink-0" />
                      <span className="font-medium text-sm sm:text-base">
                        Shares
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg sm:text-2xl font-bold text-orange-600">
                        {totalShares}
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
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
                <CardTitle className="text-lg">Key Insights</CardTitle>
                <CardDescription className="text-sm">
                  Data-driven recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4 max-h-[300px] overflow-y-auto">
                  {insights.length > 0 ? (
                    insights.map((insight, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <div
                            className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                              insight.color === "green"
                                ? "bg-green-500"
                                : "bg-blue-500"
                            }`}
                          />
                          <div className="min-w-0 flex-1">
                            <h4
                              className={`font-medium text-sm sm:text-base ${
                                insight.color === "green"
                                  ? "text-green-700"
                                  : "text-blue-700"
                              }`}
                            >
                              {insight.title}
                            </h4>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                              {insight.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-8">
                      <div className="text-sm">
                        Not enough data for insights yet. Keep sharing your
                        resume!
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="desc" className="space-y-6">
          <AnalyticsDesc data={analyticsData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

