"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Share2,
  Download,
  Upload,
  FileText,
  TrendingUp,
  Settings,
  Globe,
  Lock,
  Calendar,
  Brain,
  Shield,
  ExternalLink,
  MoreVertical,
  Plus,
  BarChart3,
  Clock,
  User,
} from "lucide-react";
import Link from "next/link";

// Using your actual data structure
const userData = {
  _id: "683b3f2f5a852f216505f6c2",
  name: "abd",
  email: "a@b.com",
  resumes: ["683b40065a852f216505f6d1"],
  provider: "email",
  isActive: true,
  aiCredits: 5,
  private: {
    profile: false,
    portfolio: false,
  },
  createdAt: "2025-05-31T17:41:03.890Z",
  updatedAt: "2025-05-31T17:44:38.552Z",
};

const resumeData = [
  {
    _id: "683b40065a852f216505f6d1",
    user: "683b3f2f5a852f216505f6c2",
    title: "Resume",
    fileUrl:
      "https://firebasestorage.googleapis.com/v0/b/movierulz-9e8da.appspot.com/o/resumes%2FResume.pdf?alt=media&token=c873cca8-0b49-419a-b90d-309d8094a147",
    tags: [],
    shortUrl: "a3a01b04-44f2-4048-a50e-eb41409dd830",
    isPublic: true,
    passwordProtected: false,
    analytics: {
      views: 0,
      downloads: 0,
      shares: 0,
    },
    createdAt: "2025-05-31T17:44:38.438Z",
    updatedAt: "2025-05-31T17:44:38.438Z",
  },
];

export default function ResumeDashboard() {
  const [selectedResume, setSelectedResume] = useState(resumeData[0]);

  // Calculate dashboard metrics
  const totalResumes = resumeData.length;
  const publicResumes = resumeData.filter((r) => r.isPublic).length;
  const privateResumes = totalResumes - publicResumes;
  const totalViews = resumeData.reduce((sum, r) => sum + r.analytics.views, 0);
  const totalDownloads = resumeData.reduce(
    (sum, r) => sum + r.analytics.downloads,
    0
  );
  const totalShares = resumeData.reduce(
    (sum, r) => sum + r.analytics.shares,
    0
  );

  // AI Credits percentage (assuming max 10)
  const aiCreditsPercentage = (userData.aiCredits / 10) * 100;

  // Days since joining
  const daysSinceJoined = Math.floor(
    (new Date().getTime() - new Date(userData.createdAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const handleDownloadResume = (resume: (typeof resumeData)[0]) => {
    const link = document.createElement("a");
    link.href = resume.fileUrl;
    link.download = `${resume.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyShareLink = (shortUrl: string) => {
    const shareUrl = `${window.location.origin}/${shortUrl}`;
    navigator.clipboard.writeText(shareUrl);
    // You can add a toast notification here
  };

  return (
    <div className="min-h-screen  p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
              <AvatarFallback className="text-lg font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {userData.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold  capitalize">
                Welcome back, {userData.name}!
              </h1>
              <p className="text-gray-600 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Member for {daysSinceJoined} days
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant={userData.isActive ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  userData.isActive ? "bg-green-500" : "bg-gray-400"
                }`}
              />
              {userData.isActive ? "Active" : "Inactive"}
            </Badge>

            <Badge variant="outline" className="capitalize">
              {userData.provider}
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Shield className="mr-2 h-4 w-4" />
                  Privacy Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Credits</CardTitle>
              <Brain className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.aiCredits}</div>
              <Progress value={aiCreditsPercentage} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {userData.aiCredits <= 2 ? "Running low" : "Credits available"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Resumes
              </CardTitle>
              <FileText className="h-4 w-4 text-green-500" />
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
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews}</div>
              <p className="text-xs text-muted-foreground">
                {totalViews === 0
                  ? "Share your resume to get views"
                  : "Across all resumes"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Downloads</CardTitle>
              <Download className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDownloads}</div>
              <p className="text-xs text-muted-foreground">
                {totalDownloads === 0 ? "No downloads yet" : "Total downloads"}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resume Management */}
          <div className="lg:col-span-2 space-y-6">
            {/* Resume List */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Your Resumes
                  </CardTitle>
                  <Button size="sm" asChild>
                    <Link href="/upload">
                      <Plus className="h-4 w-4 mr-2" />
                      Upload New
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {resumeData.map((resume) => (
                    <div
                      key={resume._id}
                      className="flex items-center justify-between p-4 border rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12  rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{resume.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant={
                                resume.isPublic ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              {resume.isPublic ? (
                                <>
                                  <Globe className="h-3 w-3 mr-1" />
                                  Public
                                </>
                              ) : (
                                <>
                                  <Lock className="h-3 w-3 mr-1" />
                                  Private
                                </>
                              )}
                            </Badge>
                            {resume.passwordProtected && (
                              <Badge variant="outline" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                Protected
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              Created{" "}
                              {new Date(resume.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="text-right text-sm">
                          <div className="font-medium">
                            {resume.analytics.views} views
                          </div>
                          <div className="text-gray-500">
                            {resume.analytics.downloads} downloads
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/${resume.shortUrl}`}
                                target="_blank"
                              >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                View Live
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/resume/${resume._id}`}>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                View Details
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => copyShareLink(resume.shortUrl)}
                            >
                              <Share2 className="mr-2 h-4 w-4" />
                              Copy Share Link
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDownloadResume(resume)}
                            >
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analytics Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Analytics Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                {totalViews === 0 ? (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No analytics data yet
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Share your resume to start collecting analytics data
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => copyShareLink(resumeData[0].shortUrl)}
                      className="mx-auto"
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Your Resume
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {totalViews}
                      </div>
                      <div className="text-sm text-gray-600">Total Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {totalDownloads}
                      </div>
                      <div className="text-sm text-gray-600">Downloads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {totalShares}
                      </div>
                      <div className="text-sm text-gray-600">Shares</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" asChild>
                  <Link href="/upload">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Resume
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/ai-analysis">
                    <Brain className="mr-2 h-4 w-4" />
                    AI Resume Analysis
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View All Analytics
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
              </CardContent>
            </Card>

            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Email
                    </label>
                    <p className="text-sm">{userData.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Provider
                    </label>
                    <p className="text-sm capitalize">{userData.provider}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Member Since
                    </label>
                    <p className="text-sm">
                      {new Date(userData.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    Privacy Settings
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Profile</span>
                      <Badge
                        variant={
                          userData.private.profile ? "secondary" : "default"
                        }
                      >
                        {userData.private.profile ? (
                          <>
                            <Lock className="h-3 w-3 mr-1" />
                            Private
                          </>
                        ) : (
                          <>
                            <Globe className="h-3 w-3 mr-1" />
                            Public
                          </>
                        )}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Portfolio</span>
                      <Badge
                        variant={
                          userData.private.portfolio ? "secondary" : "default"
                        }
                      >
                        {userData.private.portfolio ? (
                          <>
                            <Lock className="h-3 w-3 mr-1" />
                            Private
                          </>
                        ) : (
                          <>
                            <Globe className="h-3 w-3 mr-1" />
                            Public
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Upload className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium">Resume uploaded</p>
                      <p className="text-gray-500">
                        {new Date(resumeData[0].createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {totalViews === 0 && totalDownloads === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-gray-500">
                        No recent activity
                      </p>
                      <p className="text-xs text-gray-400">
                        Share your resume to see activity here
                      </p>
                    </div>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
