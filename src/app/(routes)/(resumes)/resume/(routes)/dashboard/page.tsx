"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Eye,
  Download,
  Upload,
  FileText,
  Settings,
  Globe,
  Lock,
  Calendar,
  Brain,
  BarChart3,
  LucideShare2,
} from "lucide-react";
import Link from "next/link";
import { useZustandStore } from "@/zustand/store";
import useGetUserData from "@/app/hooks/use-getUserData";
import { AlertMessage } from "@/components/main/dashboard/resumes/disable-message";
import { truncateText } from "@/app/utils/truncate-text";
import Loader from "../../widgets/loader";

export default function ResumeDashboard() {
  useGetUserData();
  const { userData } = useZustandStore();
  const resumeData = userData?.resumes;
  const totalResumes = resumeData?.length;
  const publicResumes =
    resumeData?.length !== 0 ? resumeData?.filter((r) => r.isPublic).length : 0;
  const privateResumes = totalResumes - publicResumes;
  const totalViews =
    resumeData?.length !== 0
      ? resumeData?.reduce((sum, r) => sum + r.analytics.views, 0)
      : 0;
  const totalDownloads =
    resumeData?.length !== 0
      ? resumeData?.reduce((sum, r) => sum + r.analytics.downloads, 0)
      : 0;
  const totalShares =
    resumeData?.length !== 0
      ? resumeData?.reduce((sum, r) => sum + r.analytics.shares, 0)
      : 0;

  const daysSinceJoined = Math.floor(
    (new Date().getTime() - new Date(userData?.createdAt).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (!userData) {
    return <Loader title="Dashboard" />;
  }

  const hotResume = Array.isArray(resumeData)
    ? (() => {
        const maxItem = resumeData.reduce((max, item) => {
          const views = item?.analytics?.views ?? 0;
          return views >= (max?.analytics?.views ?? 0) ? item : max;
        }, null);

        return (maxItem?.analytics?.views ?? 0) > 0 ? maxItem : null;
      })()
    : null;

  const showAlert =
    (!userData.isActive && "Disable") ||
    (userData.private.resumes && "Private");

  return (
    <div>
      {showAlert && <AlertMessage type={showAlert} />}
      <div>
        <div className=" mx-auto space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="lg:text-2xl text-xl font-bold  capitalize">
                  Welcome,
                  <span className=" text-primary pl-1">{userData?.name}!</span>
                </h1>
                {daysSinceJoined != 0 && (
                  <p className="text-gray-600 flex items-center text-sm gap-2">
                    <Calendar className="h-4 w-4" />
                    Member for {daysSinceJoined} days
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge
                variant={userData?.isActive ? "default" : "secondary"}
                className="flex items-center gap-1"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    userData?.isActive ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
                {userData?.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <CardTitle className="text-sm font-medium">
                  Total Views
                </CardTitle>
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
                  {totalDownloads === 0
                    ? "No downloads yet"
                    : "Total downloads"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shares</CardTitle>
                <LucideShare2 className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalShares}</div>
                <p className="text-xs text-muted-foreground">
                  {totalShares === 0 ? "No downloads yet" : "Total shares"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid xl:grid-cols-3 grid-cols-1  gap-y-6 xl:gap-x-6">
            <div className="lg:col-span-2 space-y-6">
              {hotResume !== null && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Hot Resume
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {resumeData?.length !== 0 &&
                        Array(
                          resumeData?.find(
                            (item) => item?.shortUrl == hotResume?.shortUrl
                          )
                        )?.map((resume, i) => (
                          <Link
                            key={i}
                            className=" group"
                            href={`/resume/resumes/${resume.shortUrl}`}
                          >
                            <div className="flex items-center justify-between group-hover:border-primary group-hover:bg-secondary/20 p-4 border rounded-lg transition-colors">
                              <div className="flex items-center gap-4">
                                <div className="sm:w-12 sm:h-12  rounded-lg flex items-center justify-center">
                                  <FileText className="h-4 w-4 sm:h-6 sm:w-6  text-blue-600" />
                                </div>
                                <div>
                                  <h3 className="font-medium text-sm lg:text-base">
                                    {truncateText(resume?.title)}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge
                                      variant={
                                        resume?.isPublic
                                          ? "default"
                                          : "secondary"
                                      }
                                      className="text-xs"
                                    >
                                      {resume?.isPublic ? (
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

                                    <span className="text-xs sm:block hidden text-gray-500">
                                      Created{" "}
                                      {new Date(
                                        resume?.createdAt
                                      ).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="text-right text-sm">
                                  <div className=" font-medium flex items-center justify-end gap-x-3">
                                    <Eye className="h-4 w-4 sm:h-6 sm:w-6  sm:hidden" />
                                    {resume?.analytics?.views}
                                    <span className=" hidden sm:block">
                                      views
                                    </span>
                                  </div>
                                  <div className="text-gray-500 flex items-center justify-end gap-x-3">
                                    <Download className="h-4 w-4 sm:h-6 sm:w-6  sm:hidden" />
                                    {resume?.analytics?.downloads}
                                    <span className=" hidden sm:block">
                                      downloads
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Link>
                        ))}
                      {resumeData?.length > 1 && (
                        <p className=" text-xs">
                          Check more
                          <Link
                            className="text-primary ml-1 "
                            href={"/resume/resumes"}
                          >
                            Resumes
                          </Link>
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

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
                        <span>Resumes</span>
                        <Badge
                          variant={
                            userData.private.resumes ? "secondary" : "default"
                          }
                        >
                          {userData.private.resumes ? (
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
            </div>

            <div className="space-y-6  xl:w-full w-fits  ">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className=" flex flex-col   w-fit lg:w-full gap-y-3">
                  <Link href="/resume/upload">
                    <Button
                      variant="outline"
                      className="w-full text-sm justify-start"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Upload New Resume
                    </Button>
                  </Link>
                  <Link href="/resume/ai">
                    <Button variant="outline" className="w-full justify-start">
                      <Brain className="mr-2 h-4 w-4" />
                      AI Resume Analysis
                    </Button>
                  </Link>
                  <Link href="/resume/analytics">
                    <Button variant="outline" className="w-full justify-start">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Detailed Analytics
                    </Button>
                  </Link>
                  <Link href="/resume/settings">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Account Settings
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
