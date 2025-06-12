"use client";
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import useGetResumeData from "@/app/hooks/use-getResumeData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Download,
  Mail,
  Phone,
  Share2,
  Maximize2,
  Globe,
  MapPin,
  User,
  Minimize2,
  ExternalLink,
  Check,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import PdfViewer from "@/app/(routes)/resume/(routes)/resumes/[resume_id]/pdf";
import TooltipWrapper from "./tooltip-wrapper";
import Analytics from "../analytics/main";
import { AnalyticsData } from "../analytics/fetch-data";

function ResumeViewerSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background dark:from-background dark:to-background p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card className="overflow-hidden border-0 shadow-xl">
              <CardContent className="p-0">
                <div className="relative">
                  <Skeleton className="w-full h-[700px] rounded-t-xl" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="text-center space-y-4">
                  <Skeleton className="w-24 h-24 rounded-full mx-auto" />
                  <div className="space-y-2">
                    <Skeleton className="h-7 w-48 mx-auto" />
                    <Skeleton className="h-4 w-32 mx-auto" />
                  </div>
                  <div className="space-y-3 pt-4">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-3/4 mx-auto" />
                    <Skeleton className="h-5 w-2/3 mx-auto" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl">
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
                <Skeleton className="h-11 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResumeViewer({ shortUrl }: { shortUrl: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const param = useSearchParams();
  const { resumeData, fetchResumeData, isLoading, error } = useGetResumeData();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchResumeDataMemoized = useCallback(() => {
    if (shortUrl) {
      fetchResumeData({ shortUrl, operation: "ResumePreview" });
    }
  }, [fetchResumeData, shortUrl]);

  useEffect(() => {
    if (!resumeData) fetchResumeDataMemoized();
  }, [fetchResumeDataMemoized, shortUrl]);

  const trackEvent = async (event: string) => {
    AnalyticsData({ resumeId: shortUrl, event });
  };

  const handleDownload = () => {
    if (resumeData?.fileUrl) {
      const link = document.createElement("a");
      link.href = resumeData.fileUrl;
      link.download = `${resumeData.name || "resume"}_resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      trackEvent("download:resume");
      toast({
        title: "✅ Resume Downloaded",
        description: "The resume has been downloaded successfully.",
      });
    } else {
      toast({
        title: "❌ Download Failed",
        description: "The resume file is not available.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    trackEvent("share:resume");
    const shareData = {
      title: `${resumeData?.name}'s Resume`,
      text: `Check out ${resumeData?.name}'s professional resume`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        toast({
          title: "📤 Shared Successfully",
          description: "Resume shared successfully!",
        });
      } catch {}
    } else if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
          title: "🔗 Link Copied",
          description: "Resume link copied to clipboard.",
        });
      } catch {
        toast({
          title: "❌ Copy Failed",
          description: "Failed to copy link to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  const handleContact = () => {
    if (resumeData?.email) {
      window.location.href = `mailto:${resumeData.email}?subject=Regarding your resume&body=Hi ${resumeData.name}, I found your resume and would like to talk.`;
      trackEvent("contact:email");
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (isLoading) {
    return <ResumeViewerSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-0 shadow-xl">
          <CardContent className="text-center p-8 space-y-4">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto">
              <User className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Resume Not Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{error}</p>
            </div>
            <Button onClick={() => router.push("/")} className="w-full">
              Explore ResumeOrg
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background dark:from-background dark:to-background  transition-colors duration-300">
      {param.get("ref") !== "demo" && <Analytics shortUrl={shortUrl} />}

      <div className="container mx-auto max-w-7xl p-4">
        <div
          className={`grid gap-6 transition-all duration-300 ${
            isFullScreen ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-4"
          }`}
        >
          <div
            className={`${isFullScreen ? "col-span-full" : "lg:col-span-3"}`}
          >
            <Card className="overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
              <CardContent className="p-0 relative group">
                <div className="absolute top-4 right-4 z-10 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <TooltipWrapper
                    title={isFullScreen ? "Minimize View" : "Maximize View"}
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={toggleFullScreen}
                      className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 shadow-lg border-0"
                    >
                      {isFullScreen ? (
                        <Minimize2 className="w-4 h-4" />
                      ) : (
                        <Maximize2 className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipWrapper>
                  <TooltipWrapper title="Download Resume">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleDownload}
                      className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 hover:bg-white dark:hover:bg-gray-900 shadow-lg border-0"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </TooltipWrapper>
                </div>

                <div
                  className={`${
                    isFullScreen ? "h-[calc(100vh-120px)]" : "h-[700px]"
                  } transition-all duration-300`}
                >
                  <PdfViewer fileUrl={shortUrl} preview={true} />
                </div>
              </CardContent>
            </Card>
          </div>

          {!isFullScreen && (
            <div className="space-y-6">
              <Card className="border-0 shadow-xl  backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <Avatar className="w-24 h-24 mx-auto border-4 border-white dark:border-gray-900 shadow-lg">
                        <AvatarImage
                          src={resumeData?.imageUrl || "/placeholder.svg"}
                          alt={resumeData?.name || "Profile"}
                        />
                        <AvatarFallback className="text-xl font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {resumeData?.name
                            ? getInitials(resumeData.name)
                            : "UN"}
                        </AvatarFallback>
                      </Avatar>
                      {/* <Badge
                        variant="secondary"
                        className="absolute -bottom-2 left-1/2 transform -trangray-x-1/2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800"
                      >
                        Available
                      </Badge> */}
                    </div>

                    <div className="space-y-1">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        {resumeData?.name || ""}
                      </h2>
                    </div>

                    <Separator className="my-4" />

                    <div className="space-y-3">
                      {resumeData?.email && (
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                          <div className="w-8 h-8  rounded-lg flex items-center justify-center">
                            <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Email
                            </p>
                            <a href={`mailto:${resumeData.email}`}>
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {resumeData.email}
                              </p>
                            </a>
                          </div>
                        </div>
                      )}

                      {resumeData?.phone && (
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                            <Phone className="w-4 h-4 text-green-600 dark:text-green-400" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Phone
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {resumeData.phone}
                            </p>
                          </div>
                        </div>
                      )}

                      {resumeData?.location && (
                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                          <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                              Location
                            </p>
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {resumeData.location}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl  backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                    Quick Actions
                  </h3>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={handleDownload}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>

                  {resumeData?.email && (
                    <Button
                      onClick={handleContact}
                      variant="outline"
                      className="w-full border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Contact Me
                    </Button>
                  )}

                  {resumeData?.portfolioUrl && (
                    <Button
                      onClick={() => {
                        window.open(resumeData.portfolioUrl, "_blank");
                        trackEvent("visit:portfolio");
                      }}
                      variant="outline"
                      className="w-full border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 transform hover:scale-[1.02]"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      View Portfolio
                      <ExternalLink className="w-3 h-3 ml-auto" />
                    </Button>
                  )}

                  <Button
                    onClick={handleShare}
                    variant="outline"
                    className="w-full border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Resume
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-xl ">
                <CardContent className="p-6">
                  <div className="text-center space-y-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Resume powered by ResumeOrg
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
