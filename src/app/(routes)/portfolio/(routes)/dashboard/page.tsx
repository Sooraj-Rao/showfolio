"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart3,
  Edit,
  Eye,
  FileText,
  Share2,
  ThumbsUp,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useGetUserData from "@/app/hooks/use-getUserData";

// Mock data for the dashboard
const mockPortfolioData = {
  name: "John Doe",
  title: "Full Stack Developer",
  views: 1248,
  likes: 57,
  shares: 23,
  lastUpdated: "2023-12-15T10:30:00Z",
  recentActivity: [
    {
      type: "view",
      message: "Someone viewed your portfolio",
      time: "2 hours ago",
    },
    {
      type: "like",
      message: "Your portfolio received a like",
      time: "5 hours ago",
    },
    { type: "share", message: "Your portfolio was shared", time: "1 day ago" },
    {
      type: "view",
      message: "Someone viewed your portfolio",
      time: "2 days ago",
    },
  ],
};

export default function DashboardPage() {
  const { userData } = useGetUserData();
  const [loading, setLoading] = useState(false);
  const [portfolioData, setportfolioData] = useState(mockPortfolioData);

  const fetchPortfolioData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/portfolio/portfolio-data");
      if (!response.ok) {
        throw new Error("Failed to fetch portfolio data");
      }
      const data = await response.json();
      setportfolioData(mockPortfolioData);
      localStorage.setItem("portfolioData", JSON.stringify(data.portfolio));
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPortfolioData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-48 bg-muted animate-pulse rounded-md"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
          <div className="h-32 bg-muted animate-pulse rounded-lg"></div>
        </div>
        <div className="h-64 bg-muted animate-pulse rounded-lg mt-4"></div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">No Portfolio Found</h2>
        <p className="text-muted-foreground mb-6">
          You haven&apos;t created a portfolio yet.
        </p>
        <Button asChild>
          <Link href="/portfolio/create">Create Portfolio</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {portfolioData.name}. Here&apos;s an overview of your
            portfolio.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/portfolio/manage">
              <Edit className="mr-2 h-4 w-4" />
              Edit Portfolio
            </Link>
          </Button>
          <Button asChild>
            <a
              href={`/p/${userData?.portfolio}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View Portfolio
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Eye className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">
                {portfolioData.views.toLocaleString()}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Likes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <ThumbsUp className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{portfolioData.likes}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +5% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Shares</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Share2 className="h-4 w-4 text-muted-foreground mr-2" />
              <div className="text-2xl font-bold">{portfolioData.shares}</div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +8% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
            <CardDescription>
              A summary of your portfolio performance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] flex items-center justify-center bg-muted/20 rounded-md">
              <div className="text-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Detailed analytics will appear here
                </p>
                <Button variant="link" asChild className="mt-2">
                  <Link href="/portfolio/analytics">View Full Analytics</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest interactions with your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {portfolioData.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-2">
                  {activity.type === "view" && (
                    <Eye className="h-4 w-4 text-muted-foreground mt-0.5" />
                  )}
                  {activity.type === "like" && (
                    <ThumbsUp className="h-4 w-4 text-muted-foreground mt-0.5" />
                  )}
                  {activity.type === "share" && (
                    <Share2 className="h-4 w-4 text-muted-foreground mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/portfolio/analytics">View All Activity</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks to manage your portfolio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-4 gap-2"
              asChild
            >
              <Link href="/portfolio/manage">
                <Edit className="h-6 w-6 mb-1" />
                <span>Update Content</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-4 gap-2"
            >
              <Share2 className="h-6 w-6 mb-1" />
              <span>Share Portfolio</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-4 gap-2"
              asChild
            >
              <Link href="/portfolio/settings">
                <Users className="h-6 w-6 mb-1" />
                <span>Privacy Settings</span>
              </Link>
            </Button>
            <Button
              variant="outline"
              className="h-auto flex flex-col items-center justify-center p-4 gap-2"
              asChild
            >
              <Link href="/portfolio/analytics">
                <BarChart3 className="h-6 w-6 mb-1" />
                <span>View Analytics</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
