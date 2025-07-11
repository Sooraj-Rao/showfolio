"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Edit,
  Eye,
  FileText,
  Users,
  TrendingUp,
  Clock,
  Globe,
  Activity,
  ExternalLink,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Zap,
  Copy,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import useGetUserData from "@/app/hooks/use-getUserData";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

interface PortfolioAnalytics {
  sessionId: string;
  page: string;
  event: string;
  section?: string;
  timeSpent: number;
  scrollDepth: number;
  device: string;
  country: string;
  city: string;
  timestamp: string;
  clickTarget?: string;
}

interface PortfolioStats {
  totalViews: number;
  uniqueVisitors: number;
  avgTimeSpent: number;
  avgScrollDepth: number;
  topCountries: Array<{ country: string; count: number }>;
  topSections: Array<{ section: string; count: number }>;
  recentActivity: Array<{
    type: string;
    message: string;
    time: string;
    location?: string;
  }>;
  deviceBreakdown: { desktop: number; mobile: number; tablet: number };
  engagementRate: number;
}

export default function DashboardPage() {
  const { userData } = useGetUserData();
  const [loading, setLoading] = useState(true);
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats | null>(
    null
  );
  const [analyticsData, setAnalyticsData] = useState<PortfolioAnalytics[]>([]);
  const [copied, setCopied] = useState(false);

  const fetchPortfolioAnalytics = async () => {
    if (!userData?.portfolio) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/portfolio/analytics/get?days=30`);
      const data = response.data.data || [];
      setAnalyticsData(data);
      const stats = processAnalyticsData(data);
      setPortfolioStats(stats);
    } catch (error) {
      console.error("Error fetching portfolio analytics:", error);
      setPortfolioStats(null);
    } finally {
      setLoading(false);
    }
  };

  const processAnalyticsData = (data: PortfolioAnalytics[]): PortfolioStats => {
    if (!data.length) {
      return {
        totalViews: 0,
        uniqueVisitors: 0,
        avgTimeSpent: 0,
        avgScrollDepth: 0,
        topCountries: [],
        topSections: [],
        recentActivity: [],
        deviceBreakdown: { desktop: 0, mobile: 0, tablet: 0 },
        engagementRate: 0,
      };
    }

    const uniqueSessions = new Set(data.map((item) => item.sessionId)).size;
    const totalViews = data.filter((item) => item.event === "page_view").length;

    const timeSpentData = data.filter(
      (item) => item.event === "time_spent" && item.timeSpent > 0
    );
    const avgTimeSpent =
      timeSpentData.length > 0
        ? timeSpentData.reduce((sum, item) => sum + item.timeSpent, 0) /
          timeSpentData.length
        : 0;

    const scrollData = data.filter((item) => item.scrollDepth > 0);
    const avgScrollDepth =
      scrollData.length > 0
        ? scrollData.reduce((sum, item) => sum + item.scrollDepth, 0) /
          scrollData.length
        : 0;

    const countryCount = data.reduce((acc, item) => {
      acc[item.country] = (acc[item.country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topCountries = Object.entries(countryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }));

    const sectionCount = data.reduce((acc, item) => {
      if (item.section) {
        acc[item.section] = (acc[item.section] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);
    const topSections = Object.entries(sectionCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([section, count]) => ({ section, count }));

    const deviceBreakdown = data.reduce(
      (acc, item) => {
        const device = item.device?.toLowerCase() || "";
        if (device.includes("mobile")) acc.mobile++;
        else if (device.includes("tablet")) acc.tablet++;
        else acc.desktop++;
        return acc;
      },
      { desktop: 0, mobile: 0, tablet: 0 }
    );

    const recentActivity = data
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 8)
      .map((item) => {
        const timeAgo = getTimeAgo(new Date(item.timestamp));
        let message = "";
        let type = item.event;

        switch (item.event) {
          case "page_view":
            message = `Portfolio viewed`;
            type = "view";
            break;
          case "section_view":
            message = `${item.section} section viewed`;
            type = "section";
            break;
          case "click":
            message = `${item.clickTarget || "Element"} clicked`;
            type = "click";
            break;
          case "contact":
            message = `Contact form interaction`;
            type = "contact";
            break;
          default:
            message = `${item.event} event`;
        }

        return {
          type,
          message,
          time: timeAgo,
          location: `${item.city}, ${item.country}`,
        };
      });

    const interactions = data.filter((item) =>
      ["click", "contact", "section_view"].includes(item.event)
    ).length;
    const engagementRate =
      totalViews > 0 ? (interactions / totalViews) * 100 : 0;

    return {
      totalViews,
      uniqueVisitors: uniqueSessions,
      avgTimeSpent,
      avgScrollDepth,
      topCountries,
      topSections,
      recentActivity,
      deviceBreakdown,
      engagementRate,
    };
  };

  const getTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/p/${userData.portfolio}?ref=demo`
      );
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Portfolio link has been copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (userData?.portfolio) {
      fetchPortfolioAnalytics();
    }
  }, [userData]);

  const sessionMap = new Map();

  analyticsData.forEach(({ sessionId, country, city }) => {
    if (!sessionMap.has(sessionId)) {
      sessionMap.set(sessionId, {
        id: sessionId,
        event: 1,
        location: city + ", " + country,
      });
    } else {
      sessionMap.get(sessionId).event++;
    }
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 bg-muted animate-pulse rounded-md"></div>
            <div className="h-5 w-96 bg-muted animate-pulse rounded-md"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-muted animate-pulse rounded-md"></div>
            <div className="h-10 w-32 bg-muted animate-pulse rounded-md"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-muted animate-pulse rounded-lg"
            ></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-muted animate-pulse rounded-lg"></div>
          <div className="space-y-4">
            <div className="h-48 bg-muted animate-pulse rounded-lg"></div>
            <div className="h-48 bg-muted animate-pulse rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData?.portfolio) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Create Your Portfolio</h2>
            <p className="text-muted-foreground max-w-md">
              Start showcasing your work and skills with a professional
              portfolio.
            </p>
          </div>
          <Button asChild size="lg" className="mt-4">
            <Link href="/portfolio/create">
              <FileText className="mr-2 h-4 w-4" />
              Create Portfolio
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const totalDeviceViews =
    (portfolioStats?.deviceBreakdown.desktop || 0) +
    (portfolioStats?.deviceBreakdown.mobile || 0) +
    (portfolioStats?.deviceBreakdown.tablet || 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between w-full   bg-background  rounded-md ">
        <span className="text-lg flex items-center font-semibold text-foreground">
          Your portfolio is Live
          <a
            target="_blank"
            href={`${process.env.NEXT_PUBLIC_APP_URL!}/p/${
              userData?.portfolio
            }?ref=demo`}
          >
            <code className=" text-sm px-5 hover:underline underline-offset-4 text-blue-500 font-semibold">
              {process.env.NEXT_PUBLIC_APP_URL!}
              /p/{userData?.portfolio}
            </code>
          </a>
        </span>
        <div className=" flex gap-x-6">
          <Button
            onClick={handleCopyLink}
            variant={!copied ? "secondary" : "outline"}
          >
            {copied ? (
              <>
                Copied
                <CheckCircle className="h-6 w-6 text-green-500" />
              </>
            ) : (
              <>
                Copy
                <Copy className="w-4 h-4 text-foreground " />
              </>
            )}
          </Button>
          <a
            href={`/p/${userData.portfolio}?ref=demo`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button>
              <span>View Live</span>
              <ExternalLink className="w-4 h-4 text-primary-foreground" />
            </Button>
          </a>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">
            Portfolio Dashboard
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" asChild>
            <Link href="/portfolio/manage">
              <Edit className="mr-2 h-4 w-4" />
              Edit Portfolio
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Views
              </CardTitle>
              <Eye className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {portfolioStats?.totalViews || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Unique Visitors
              </CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {portfolioStats?.uniqueVisitors || 0}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Unique sessions
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Time Spent
              </CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {formatTime(portfolioStats?.avgTimeSpent || 0)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Per session</p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Engagement Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {Math.round(portfolioStats?.engagementRate || 0)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Interactions per view
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                <CardTitle>Recent Activity</CardTitle>
              </div>
            </div>
            <CardDescription>
              Latest visitor interactions with your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3  ">
              {portfolioStats?.recentActivity.length ? (
                Array.from(sessionMap.values())
                  .slice(0, 3)
                  .map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        {activity.type === "view" && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        )}
                        {activity.type === "section" && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                        {activity.type === "click" && (
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        )}
                        {activity.type === "contact" && (
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Session Activity</p>
                        <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span>{activity.event} events</span>
                          {activity.location && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{activity.location}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
              ) : (
                <p>No recent activity.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Device Usage
              </CardTitle>
              <CardDescription>
                How visitors access your portfolio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {portfolioStats?.deviceBreakdown && totalDeviceViews > 0 ? (
                <>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Desktop</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {portfolioStats.deviceBreakdown.desktop}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          (
                          {Math.round(
                            (portfolioStats.deviceBreakdown.desktop /
                              totalDeviceViews) *
                              100
                          )}
                          %)
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={
                        (portfolioStats.deviceBreakdown.desktop /
                          totalDeviceViews) *
                        100
                      }
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Mobile</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {portfolioStats.deviceBreakdown.mobile}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          (
                          {Math.round(
                            (portfolioStats.deviceBreakdown.mobile /
                              totalDeviceViews) *
                              100
                          )}
                          %)
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={
                        (portfolioStats.deviceBreakdown.mobile /
                          totalDeviceViews) *
                        100
                      }
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Tablet className="h-4 w-4 text-orange-500" />
                        <span className="text-sm">Tablet</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {portfolioStats.deviceBreakdown.tablet}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          (
                          {Math.round(
                            (portfolioStats.deviceBreakdown.tablet /
                              totalDeviceViews) *
                              100
                          )}
                          %)
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={
                        (portfolioStats.deviceBreakdown.tablet /
                          totalDeviceViews) *
                        100
                      }
                      className="h-2"
                    />
                  </div>
                </>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Monitor className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No device data yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Top Locations
              </CardTitle>
              <CardDescription>Where your visitors are from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {portfolioStats?.topCountries.length ? (
                  portfolioStats.topCountries.map((country, index) => (
                    <div
                      key={country.country}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="text-sm font-medium">
                          {country.country}
                        </span>
                      </div>
                      <Badge variant="secondary">{country.count}</Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Globe className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No location data yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Manage and share your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-6 gap-3 hover:bg-muted/50 bg-transparent"
              asChild
            >
              <Link href="/portfolio/manage">
                <Edit className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Update Content</div>
                  <div className="text-xs text-muted-foreground">
                    Edit your portfolio
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-6 gap-3 hover:bg-muted/50 bg-transparent"
              onClick={handleCopyLink}
            >
              {copied ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
              ) : (
                <Copy className="h-6 w-6" />
              )}
              <div className="text-center">
                <div className="font-medium">Share Portfolio</div>
                <div className="text-xs text-muted-foreground">
                  Copy link to clipboard
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-6 gap-3 hover:bg-muted/50 bg-transparent"
              asChild
            >
              <Link href="/portfolio/analytics">
                <BarChart3 className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">View Analytics</div>
                  <div className="text-xs text-muted-foreground">
                    Detailed insights
                  </div>
                </div>
              </Link>
            </Button>

            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-6 gap-3 hover:bg-muted/50 bg-transparent"
              asChild
            >
              <Link href="/portfolio/settings">
                <Users className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">Settings</div>
                  <div className="text-xs text-muted-foreground">
                    Privacy & preferences
                  </div>
                </div>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
