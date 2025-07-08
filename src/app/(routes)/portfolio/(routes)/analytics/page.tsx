/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Eye,
  Clock,
  Users,
  MousePointer,
  TrendingUp,
  Activity,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ChevronDown,
  ChevronUp,
  Navigation,
  ExternalLink,
  MapPin,
  Wifi,
  BarChart3,
  PieChart,
  Target,
  Zap,
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import axios from "axios";

const COLORS = [
  "#8B5CF6",
  "#06B6D4",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#EC4899",
  "#6366F1",
  "#84CC16",
];

interface AnalyticsItem {
  _id: string;
  sessionId: string;
  page: string;
  section?: string;
  anchor?: string;
  event: string;
  timeSpent: number;
  scrollDepth: number;
  clickTarget?: string;
  device: string;
  os: string;
  browser: string;
  screenResolution?: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  referrer?: string;
  userAgent: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

interface AnalyticsSummary {
  totalEvents: number;
  uniqueSessions: number;
  totalTimeSpent: number;
  avgTimeSpent: number;
  eventCounts: Record<string, number>;
  deviceCounts: Record<string, number>;
  countryCounts: Record<string, number>;
}

export default function PortfolioAnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsItem[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(
    new Set()
  );

  const fetchData = async () => {
    try {
      setLoading(true);
      const days =
        timeRange === "24h"
          ? 1
          : timeRange === "7d"
          ? 7
          : timeRange === "30d"
          ? 30
          : 90;
      const res = await axios.get(`/api/portfolio/analytics/get?days=${days}`);
      setAnalyticsData(res.data.data || []);
      setSummary(res.data.summary || null);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      setAnalyticsData([]);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange]);

  const analytics = useMemo(() => {
    if (!analyticsData.length) return null;

    const sectionEngagement = analyticsData.reduce((acc, item) => {
      if (item.section) {
        if (!acc[item.section]) {
          acc[item.section] = {
            views: 0,
            totalTime: 0,
            clicks: 0,
            avgScrollDepth: 0,
            scrollSamples: 0,
            uniqueSessions: new Set(),
          };
        }

        acc[item.section].uniqueSessions.add(item.sessionId);
        if (item.event === "section_view") acc[item.section].views++;
        if (item.event === "click") acc[item.section].clicks++;
        if (item.event === "time_spent")
          acc[item.section].totalTime += item.timeSpent;
        if (item.scrollDepth > 0) {
          acc[item.section].avgScrollDepth =
            (acc[item.section].avgScrollDepth *
              acc[item.section].scrollSamples +
              item.scrollDepth) /
            (acc[item.section].scrollSamples + 1);
          acc[item.section].scrollSamples++;
        }
      }
      return acc;
    }, {} as Record<string, any>);

    const deviceAnalytics = analyticsData.reduce((acc, item) => {
      if (!acc[item.device]) acc[item.device] = 0;
      acc[item.device]++;
      return acc;
    }, {} as Record<string, number>);

    const osAnalytics = analyticsData.reduce((acc, item) => {
      if (!acc[item.os]) acc[item.os] = 0;
      acc[item.os]++;
      return acc;
    }, {} as Record<string, number>);

    const browserAnalytics = analyticsData.reduce((acc, item) => {
      if (!acc[item.browser]) acc[item.browser] = 0;
      acc[item.browser]++;
      return acc;
    }, {} as Record<string, number>);

    const countryAnalytics = analyticsData.reduce((acc, item) => {
      if (!acc[item.country]) acc[item.country] = 0;
      acc[item.country]++;
      return acc;
    }, {} as Record<string, number>);

    const cityAnalytics = analyticsData.reduce((acc, item) => {
      const location = `${item.city}, ${item.country}`;
      if (!acc[location]) acc[location] = 0;
      acc[location]++;
      return acc;
    }, {} as Record<string, number>);

    const totalEvents = analyticsData.length;
    const referrerAnalytics = analyticsData.reduce((acc, item) => {
      let referrer = "Direct";
      if (item.referrer) {
        if (item.referrer.includes("linkedin")) referrer = "LinkedIn";
        else if (
          item.referrer.includes("twitter") ||
          item.referrer.includes("x.com")
        )
          referrer = "Twitter";
        else if (item.referrer.includes("github")) referrer = "GitHub";
        else if (item.referrer.includes("google")) referrer = "Google";
        else if (item.referrer.includes("facebook")) referrer = "Facebook";
        else if (item.referrer.startsWith("http"))
          referrer = "External Website";
        else referrer = item.referrer.split("_")[0] || "Other";
      }

      if (!acc[referrer]) acc[referrer] = 0;
      acc[referrer]++;
      return acc;
    }, {} as Record<string, number>);

    const userSessions = analyticsData.reduce((acc, item) => {
      if (!acc[item.sessionId]) {
        acc[item.sessionId] = {
          sessionId: item.sessionId,
          events: [],
          totalTime: 0,
          sections: new Set(),
          device: item.device,
          os: item.os,
          browser: item.browser,
          country: item.country,
          city: item.city,
          referrer: item.referrer,
          startTime: item.timestamp,
          endTime: item.timestamp,
          pageViews: 0,
          clicks: 0,
          maxScrollDepth: 0,
        };
      }

      acc[item.sessionId].events.push(item);
      if (item.section) acc[item.sessionId].sections.add(item.section);
      if (item.event === "page_view") acc[item.sessionId].pageViews++;
      if (item.event === "click") acc[item.sessionId].clicks++;
      if (item.event === "time_spent") {
        acc[item.sessionId].totalTime = Math.max(
          acc[item.sessionId].totalTime,
          item.timeSpent
        );
      }
      if (item.scrollDepth > acc[item.sessionId].maxScrollDepth) {
        acc[item.sessionId].maxScrollDepth = item.scrollDepth;
      }

      if (new Date(item.timestamp) > new Date(acc[item.sessionId].endTime)) {
        acc[item.sessionId].endTime = item.timestamp;
      }
      if (new Date(item.timestamp) < new Date(acc[item.sessionId].startTime)) {
        acc[item.sessionId].startTime = item.timestamp;
      }

      return acc;
    }, {} as Record<string, any>);

    const timeSeriesData = analyticsData.reduce((acc, item) => {
      const date = new Date(item.timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      if (!acc[date]) {
        acc[date] = { date, events: 0, sessions: new Set(), timeSpent: 0 };
      }

      acc[date].events++;
      acc[date].sessions.add(item.sessionId);
      if (item.event === "time_spent") {
        acc[date].timeSpent += item.timeSpent;
      }

      return acc;
    }, {} as Record<string, any>);

    return {
      sectionEngagement: Object.entries(sectionEngagement).map(
        ([section, data]) => ({
          section,
          ...data,
          uniqueSessions: data.uniqueSessions.size,
          avgTime: data.totalTime / Math.max(data.views, 1),
          engagementScore:
            (data.views * 0.3 + data.clicks * 0.4 + data.avgScrollDepth * 0.3) /
            100,
        })
      ),
      deviceAnalytics: Object.entries(deviceAnalytics)
        .map(([device, count]) => ({
          name: device.charAt(0).toUpperCase() + device.slice(1),
          value: count,
          percentage: ((count / totalEvents) * 100).toFixed(1),
        }))
        .sort((a, b) => b.value - a.value),
      osAnalytics: Object.entries(osAnalytics)
        .map(([os, count]) => ({
          name: os,
          value: count,
          percentage: ((count / totalEvents) * 100).toFixed(1),
        }))
        .sort((a, b) => b.value - a.value),
      browserAnalytics: Object.entries(browserAnalytics)
        .map(([browser, count]) => ({
          name: browser,
          value: count,
          percentage: ((count / totalEvents) * 100).toFixed(1),
        }))
        .sort((a, b) => b.value - a.value),
      countryAnalytics: Object.entries(countryAnalytics)
        .map(([country, count]) => ({
          name: country,
          value: count,
          percentage: ((count / totalEvents) * 100).toFixed(1),
        }))
        .sort((a, b) => b.value - a.value),
      cityAnalytics: Object.entries(cityAnalytics)
        .map(([city, count]) => ({
          name: city,
          value: count,
          percentage: ((count / totalEvents) * 100).toFixed(1),
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10),
      referrerAnalytics: Object.entries(referrerAnalytics)
        .map(([source, count]) => ({
          name: source,
          value: count,
          percentage: ((count / totalEvents) * 100).toFixed(1),
        }))
        .sort((a, b) => b.value - a.value),
      userSessions: Object.values(userSessions).sort(
        (a: any, b: any) =>
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
      ),
      timeSeriesData: Object.values(timeSeriesData)
        .map((item: any) => ({
          ...item,
          sessions: item.sessions.size,
        }))
        .sort(
          (a: any, b: any) =>
            new Date(a.date + ", 2025").getTime() -
            new Date(b.date + ", 2025").getTime()
        ),
    };
  }, [analyticsData]);



  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;
    return `${Math.floor(seconds / 3600)}h ${Math.floor(
      (seconds % 3600) / 60
    )}m`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      full: date.toLocaleString(),
    };
  };

  const getEventIcon = (event: string) => {
    const iconMap = {
      page_view: <Eye className="w-4 h-4 text-blue-500" />,
      section_view: <Target className="w-4 h-4 text-green-500" />,
      click: <MousePointer className="w-4 h-4 text-orange-500" />,
      time_spent: <Clock className="w-4 h-4 text-purple-500" />,
      scroll_depth: <TrendingUp className="w-4 h-4 text-indigo-500" />,
      project_view: <Eye className="w-4 h-4 text-cyan-500" />,
      external_link_click: <ExternalLink className="w-4 h-4 text-red-500" />,
      social_link_click: <Globe className="w-4 h-4 text-pink-500" />,
      contact_form_submit: <Zap className="w-4 h-4 text-emerald-500" />,
    };
    return (
      iconMap[event as keyof typeof iconMap] || (
        <Activity className="w-4 h-4 text-gray-500" />
      )
    );
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      case "tablet":
        return <Tablet className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const toggleSessionExpansion = (sessionId: string) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex-1 space-y-4 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-lg font-medium">
              Loading portfolio analytics...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto space-y-6 ">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Portfolio Analytics
          </h2>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {summary?.uniqueSessions || 0}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Unique visitors
              </span>
            </div>
          </CardContent>
        </Card>

        <Card >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Session Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatTime(summary?.avgTimeSpent || 0)}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Per visitor</span>
            </div>
          </CardContent>
        </Card>

        <Card >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Interactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {summary?.eventCounts.click || 0}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <MousePointer className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Clicks & taps
              </span>
            </div>
          </CardContent>
        </Card>

        <Card >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Page Views
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {summary?.eventCounts.page_view || 0}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Eye className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                Portfolio visits
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="traffic">Traffic</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-blue-500" />
                  Activity Timeline
                </CardTitle>
                <CardDescription>
                  Daily portfolio activity and engagement
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.timeSeriesData.length ? (
                  <ChartContainer
                    config={{
                      events: { label: "Events", color: "hsl(var(--chart-1))" },
                      sessions: {
                        label: "Sessions",
                        color: "hsl(var(--chart-2))",
                      },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analytics.timeSeriesData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area
                          type="monotone"
                          dataKey="events"
                          stackId="1"
                          stroke="var(--color-events)"
                          fill="var(--color-events)"
                          fillOpacity={0.6}
                        />
                        <Area
                          type="monotone"
                          dataKey="sessions"
                          stackId="2"
                          stroke="var(--color-sessions)"
                          fill="var(--color-sessions)"
                          fillOpacity={0.6}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No activity data available
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-green-500" />
                  Event Distribution
                </CardTitle>
                <CardDescription>
                  Types of interactions on your portfolio
                </CardDescription>
              </CardHeader>
              <CardContent>
                {summary?.eventCounts ? (
                  <ChartContainer
                    config={{
                      value: { label: "Count" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={Object.entries(summary.eventCounts).map(
                            ([key, value], index) => ({
                              name: key
                                .replace("_", " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase()),
                              value,
                              fill: COLORS[index % COLORS.length],
                            })
                          )}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {Object.entries(summary.eventCounts).map(
                            (_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            )
                          )}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                ) : (
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                    No event data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Device Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics?.deviceAnalytics.length ? (
                  <div className="space-y-4">
                    <ChartContainer
                      config={{ value: { label: "Count" } }}
                      className="h-[200px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={analytics.deviceAnalytics}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {analytics.deviceAnalytics.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    <div className="space-y-2">
                      {analytics.deviceAnalytics.map((device: any, index) => (
                        <div
                          key={device.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                            <span className="font-medium">{device.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {device.value} ({device.percentage}%)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No device data
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="w-5 h-5" />
                  Operating Systems
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics?.osAnalytics.length ? (
                  <div className="space-y-4">
                    <ChartContainer
                      config={{ value: { label: "Count" } }}
                      className="h-[200px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={analytics.osAnalytics}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {analytics.osAnalytics.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    <div className="space-y-2">
                      {analytics.osAnalytics.map((os: any, index) => (
                        <div
                          key={os.name}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{
                                backgroundColor: COLORS[index % COLORS.length],
                              }}
                            />
                            <span className="font-medium">{os.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {os.value} ({os.percentage}%)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No OS data
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Browsers
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analytics?.browserAnalytics.length ? (
                  <div className="space-y-4">
                    <ChartContainer
                      config={{ value: { label: "Count" } }}
                      className="h-[200px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={analytics.browserAnalytics}
                            cx="50%"
                            cy="50%"
                            outerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {analytics.browserAnalytics.map((_, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={COLORS[index % COLORS.length]}
                              />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    <div className="space-y-2">
                      {analytics.browserAnalytics.map((browser: any, index) => (
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
                            <span className="font-medium">{browser.name}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {browser.value} ({browser.percentage}%)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No browser data
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" />
                  Geographic Distribution
                </CardTitle>
                <CardDescription>
                  Countries where your visitors are from
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.countryAnalytics.length ? (
                  <div className="space-y-3">
                    {analytics.countryAnalytics
                      .slice(0, 8)
                      .map((country: any, index) => (
                        <div
                          key={country.name}
                          className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 text-sm font-bold">
                              {index + 1}
                            </div>
                            <span className="font-medium">{country.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{country.value}</div>
                            <div className="text-xs text-muted-foreground">
                              {country.percentage}%
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No geographic data
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-500" />
                  Top Locations
                </CardTitle>
                <CardDescription>Cities with the most visitors</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics?.cityAnalytics.length ? (
                  <div className="space-y-3">
                    {analytics.cityAnalytics.map((city: any, index) => (
                      <div
                        key={city.name}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 text-sm font-bold">
                            {index + 1}
                          </div>
                          <span className="font-medium">{city.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{city.value}</div>
                          <div className="text-xs text-muted-foreground">
                            {city.percentage}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No city data
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-purple-500" />
                Traffic Sources
              </CardTitle>
              <CardDescription>
                Where your portfolio visitors are coming from
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.referrerAnalytics.length ? (
                <div className="grid gap-6 lg:grid-cols-2">
                  <ChartContainer
                    config={{ value: { label: "Visits" } }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={analytics.referrerAnalytics}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percentage }) =>
                            `${name} ${percentage}%`
                          }
                        >
                          {analytics.referrerAnalytics.map((_, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  <div className="space-y-3">
                    {analytics.referrerAnalytics.map((source: any, index) => (
                      <div
                        key={source.name}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{
                              backgroundColor: COLORS[index % COLORS.length],
                            }}
                          />
                          <span className="font-medium">{source.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            {source.value} visits
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {source.percentage}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No traffic source data
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-500" />
                User Sessions
              </CardTitle>
              <CardDescription>
                Detailed view of individual user sessions and journeys
              </CardDescription>
            </CardHeader>
            <CardContent>
              {analytics?.userSessions.length ? (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {analytics.userSessions.slice(0, 20).map((session: any) => (
                    <Collapsible key={session.sessionId}>
                      <CollapsibleTrigger
                        className="w-full"
                        onClick={() =>
                          toggleSessionExpansion(session.sessionId)
                        }
                      >
                        <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              {getDeviceIcon(session.device)}
                              <span className="font-medium">Session</span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>
                                {session.city}, {session.country}
                              </span>
                              <span>{session.sections.size} sections</span>
                              <span>{session.clicks} clicks</span>
                              <span>{formatTime(session.totalTime)}</span>
                              <span>{formatDate(session.startTime).full}</span>
                            </div>
                          </div>
                          {expandedSessions.has(session.sessionId) ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="ml-4 mt-2 space-y-4 border-l-2 border-muted pl-4">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-muted/20 rounded-lg text-sm">
                            <div>
                              <div className="text-muted-foreground">
                                Device
                              </div>
                              <div className="font-medium">
                                {session.device} • {session.os}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">
                                Browser
                              </div>
                              <div className="font-medium">
                                {session.browser}
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">
                                Max Scroll
                              </div>
                              <div className="font-medium">
                                {session.maxScrollDepth}%
                              </div>
                            </div>
                            <div>
                              <div className="text-muted-foreground">
                                Referrer
                              </div>
                              <div className="font-medium">
                                {session.referrer
                                  ? session.referrer.includes("linkedin")
                                    ? "LinkedIn"
                                    : session.referrer.includes("github")
                                    ? "GitHub"
                                    : session.referrer.includes("google")
                                    ? "Google"
                                    : session.referrer.split("_")[0] || "Other"
                                  : "Direct"}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium">Session Timeline</h4>
                            {session.events
                              .sort(
                                (a: any, b: any) =>
                                  new Date(a.timestamp).getTime() -
                                  new Date(b.timestamp).getTime()
                              )
                              .map((event: any) => (
                                <div
                                  key={event._id}
                                  className="flex items-center gap-3 p-2 rounded bg-muted/20"
                                >
                                  <div className="flex items-center gap-2 min-w-[120px]">
                                    {getEventIcon(event.event)}
                                    <span className="text-sm font-medium">
                                      {event.event.replace("_", " ")}
                                    </span>
                                  </div>
                                  <div className="flex-1 text-sm text-muted-foreground">
                                    {event.section &&
                                      `${event.section} section`}
                                    {event.clickTarget &&
                                      ` → ${event.clickTarget.replace(
                                        /_/g,
                                        " "
                                      )}`}
                                    {event.timeSpent > 0 &&
                                      ` (${formatTime(event.timeSpent)})`}
                                    {event.scrollDepth > 0 &&
                                      ` (${event.scrollDepth}% scroll)`}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {formatDate(event.timestamp).time}
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No session data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
