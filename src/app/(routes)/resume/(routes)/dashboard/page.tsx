"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Eye,
  Share2,
  Download,
  Upload,
  FolderOpen,
  Tag,
  FileText,
  TrendingUp,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useZustandStore } from "@/zustand/store";
// import { useRouter } from "next/navigation";
// import useGetUserData from "@/app/hooks/use-getUserData";

// Mock data for the chart
const chartData = [
  { name: "Jan", views: 400, downloads: 240 },
  { name: "Feb", views: 300, downloads: 139 },
  { name: "Mar", views: 200, downloads: 980 },
  { name: "Apr", views: 278, downloads: 390 },
  { name: "May", views: 189, downloads: 480 },
  { name: "Jun", views: 239, downloads: 380 },
  { name: "Jul", views: 349, downloads: 430 },
];

// Mock data for recent activity
const recentActivity = [
  {
    id: 1,
    action: "View",
    resume: "Software Engineer Resume",
    user: "John Doe",
    time: "2 hours ago",
  },
  {
    id: 2,
    action: "Download",
    resume: "Product Manager CV",
    user: "Jane Smith",
    time: "5 hours ago",
  },
  {
    id: 3,
    action: "Share",
    resume: "Data Analyst Resume",
    user: "Mike Johnson",
    time: "1 day ago",
  },
  {
    id: 4,
    action: "Edit",
    resume: "Marketing Specialist CV",
    user: "You",
    time: "2 days ago",
  },
];

export default function ResumeDashboard() {
  // const [IsLoading, setIsLoading] = useState(true);

  // const [errorMsg, setErrorMsg] = useState("");

  return (
    <div className="p-3 space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">56</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Downloads
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Resume Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#8884d8" />
                <Line type="monotone" dataKey="downloads" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{activity.user[0]}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {activity.user} {activity.action.toLowerCase()}ed your{" "}
                      {activity.resume}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    {activity.action}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Performing Resumes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Software Engineer Resume", views: 450, downloads: 89 },
                { name: "Product Manager CV", views: 320, downloads: 62 },
                { name: "Data Analyst Resume", views: 280, downloads: 51 },
              ].map((resume, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center">
                    <span className="font-medium">{resume.name}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {resume.views} views
                    </Badge>
                  </div>
                  <Progress
                    value={(resume.downloads / resume.views) * 100}
                    className="h-2"
                  />
                  <p className="text-sm text-muted-foreground">
                    {resume.downloads} downloads (
                    {((resume.downloads / resume.views) * 100).toFixed(1)}%
                    conversion)
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full">
              <Upload className="mr-2 h-4 w-4" /> Upload New Resume
            </Button>
            <Button className="w-full" variant="outline">
              <FolderOpen className="mr-2 h-4 w-4" /> Organize Resumes
            </Button>
            <Button className="w-full" variant="outline">
              <Tag className="mr-2 h-4 w-4" /> Manage Tags
            </Button>
            <Button className="w-full" variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" /> View Detailed Analytics
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
