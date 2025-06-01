"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Share2,
  Download,
  Upload,
  FolderOpen,
  FileText,
  TrendingUp,
  Settings,
  Globe,
  Lock,
  Star,
  Calendar,
  Users,
  BarChart3,
  Zap,
  MoreVertical,
  ExternalLink,
  Brain,
  Shield,
  Sparkles,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";
import type { IUser } from "@/models/user";
import type { IResume } from "@/models/resume";

interface DashboardProps {
  user: IUser;
  resumes: IResume[];
  analytics: {
    totalViews: number;
    totalDownloads: number;
    totalShares: number;
    monthlyGrowth: {
      views: number;
      downloads: number;
      shares: number;
    };
    chartData: Array<{
      name: string;
      views: number;
      downloads: number;
      shares: number;
    }>;
    topResumes: Array<{
      id: string;
      title: string;
      views: number;
      downloads: number;
      shares: number;
      conversionRate: number;
    }>;
    recentActivity: Array<{
      id: string;
      type: "view" | "download" | "share" | "upload";
      resumeTitle: string;
      timestamp: Date;
      userAgent?: string;
    }>;
  };
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function ResumeDashboard({
  user,
  resumes,
  analytics,
}: DashboardProps) {
  const [selectedTimeframe, setSelectedTimeframe] = useState("7d");

  // Calculate user stats
  const totalResumes = resumes?.length;
  const publicResumes = resumes?.filter((r) => r.isPublic).length;
  const privateResumes = totalResumes - publicResumes;
  const passwordProtectedResumes = resumes?.filter(
    (r) => r.passwordProtected
  ).length;

  // AI Credits status
  const aiCreditsPercentage = (user?.aiCredits / 10) * 100; // Assuming 10 is max
  const isLowCredits = user?.aiCredits <= 2;

  // Privacy settings summary
  const privacyScore =
    user && Object?.values(user?.private)?.filter((setting) => !setting).length;

  // Resume visibility data for pie chart
  const visibilityData = [
    { name: "Public", value: publicResumes, color: "#00C49F" },
    { name: "Private", value: privateResumes, color: "#FF8042" },
    {
      name: "Password Protected",
      value: passwordProtectedResumes,
      color: "#FFBB28",
    },
  ];

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
              <AvatarImage
                src={user?.imageUrl || "/placeholder.svg"}
                alt={user?.name}
              />
              <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {user?.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name.split(" ")[0]}!
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Member since {new Date(user?.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant={user?.isActive ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  user?.isActive ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              {user?.isActive ? "Active" : "Inactive"}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4" />
                  Privacy Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Globe className="mr-2 h-4 w-4" />
                  Portfolio Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* AI Credits & Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card
            className={`${
              isLowCredits ? "border-orange-200 bg-orange-50" : ""
            }`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Credits</CardTitle>
              <Brain
                className={`h-4 w-4 ${
                  isLowCredits ? "text-orange-500" : "text-blue-500"
                }`}
              />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.aiCredits}</div>
              <Progress value={aiCreditsPercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {isLowCredits
                  ? "Running low - consider upgrading"
                  : "Credits remaining"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Resumes
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResumes}</div>
              <p className="text-xs text-muted-foreground">
                {publicResumes} public, {privateResumes} private
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Privacy Score
              </CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{privacyScore}/3</div>
              <p className="text-xs text-muted-foreground">
                Settings configured
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Provider</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {user?.provider}
              </div>
              <p className="text-xs text-muted-foreground">
                Authentication method
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.totalViews?.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />+
                {analytics?.monthlyGrowth?.views}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Downloads
              </CardTitle>
              <Download className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.totalDownloads.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />+
                {analytics?.monthlyGrowth.downloads}% from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Shares
              </CardTitle>
              <Share2 className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {analytics?.totalShares.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />+
                {analytics?.monthlyGrowth.shares}% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Performance Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Resume Performance</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      {selectedTimeframe === "7d"
                        ? "Last 7 days"
                        : selectedTimeframe === "30d"
                        ? "Last 30 days"
                        : "Last 90 days"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => setSelectedTimeframe("7d")}
                    >
                      Last 7 days
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedTimeframe("30d")}
                    >
                      Last 30 days
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => setSelectedTimeframe("90d")}
                    >
                      Last 90 days
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics?.chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#3B82F6"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="downloads"
                    stroke="#10B981"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="shares"
                    stroke="#8B5CF6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Resume Visibility Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Resume Visibility</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={visibilityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {visibilityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {visibilityData.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Resumes & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Top Performing Resumes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.topResumes.slice(0, 5).map((resume, index) => (
                  <div key={resume.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="w-6 h-6 p-0 flex items-center justify-center text-xs"
                        >
                          {index + 1}
                        </Badge>
                        <span className="font-medium text-sm">
                          {resume.title}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {resume.views} views
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0"
                            >
                              <MoreVertical className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                              <Link href={`/resume/${resume.id}`}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <Progress value={resume.conversionRate} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{resume.downloads} downloads</span>
                      <span>
                        {resume.conversionRate.toFixed(1)}% conversion
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics?.recentActivity.slice(0, 6).map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {activity.type === "view" && (
                        <Eye className="h-4 w-4 text-blue-500" />
                      )}
                      {activity.type === "download" && (
                        <Download className="h-4 w-4 text-green-500" />
                      )}
                      {activity.type === "share" && (
                        <Share2 className="h-4 w-4 text-purple-500" />
                      )}
                      {activity.type === "upload" && (
                        <Upload className="h-4 w-4 text-orange-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {activity.resumeTitle}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.type === "upload"
                          ? "Uploaded"
                          : `${activity.type}ed`}{" "}
                        • {new Date(activity.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs capitalize">
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Portfolio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" asChild>
                <Link href="/resume/upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Upload New Resume
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/resume/resumes">
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Manage All Resumes
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                asChild
              >
                <Link href="/resume/ai">
                  <Brain className="mr-2 h-4 w-4" />
                  AI Resume Analysis
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="mr-2 h-4 w-4" />
                Detailed Analytics
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-500" />
                Portfolio & Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Portfolio URL</span>
                  {user?.portfolio ? (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={user?.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </a>
                    </Button>
                  ) : (
                    <Badge variant="secondary">Not set</Badge>
                  )}
                </div>

                <Separator />

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Privacy Settings</h4>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Portfolio</span>
                      <Badge
                        variant={
                          user?.private.portfolio ? "secondary" : "default"
                        }
                      >
                        {user?.private.portfolio ? (
                          <Lock className="h-3 w-3 mr-1" />
                        ) : (
                          <Globe className="h-3 w-3 mr-1" />
                        )}
                        {user?.private.portfolio ? "Private" : "Public"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Profile</span>
                      <Badge
                        variant={
                          user?.private.profile ? "secondary" : "default"
                        }
                      >
                        {user?.private.profile ? (
                          <Lock className="h-3 w-3 mr-1" />
                        ) : (
                          <Globe className="h-3 w-3 mr-1" />
                        )}
                        {user?.private.profile ? "Private" : "Public"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Resumes</span>
                      <Badge
                        variant={
                          user?.private.resumes ? "secondary" : "default"
                        }
                      >
                        {user?.private.resumes ? (
                          <Lock className="h-3 w-3 mr-1" />
                        ) : (
                          <Globe className="h-3 w-3 mr-1" />
                        )}
                        {user?.private.resumes ? "Private" : "Public"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Credits Warning */}
        {isLowCredits && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <Sparkles className="h-8 w-8 text-orange-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900">
                    Running Low on AI Credits
                  </h3>
                  <p className="text-orange-700 text-sm">
                    You have {user?.aiCredits} AI credits remaining. Upgrade
                    your plan to continue using AI-powered resume analysis and
                    feedback.
                  </p>
                </div>
                <Button className="bg-orange-600 hover:bg-orange-700">
                  Upgrade Plan
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
