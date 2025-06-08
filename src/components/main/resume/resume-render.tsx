"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import useGetResumeData from "@/app/hooks/use-getResumeData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Download,
  Mail,
  Phone,
  Share2,
  Maximize2,
  FileDown,
  Globe,
  MapPin,
  User,
  Minimize2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import PdfViewer from "@/app/(routes)/resume/(routes)/resumes/[resume_id]/pdf";
import { ClickEvent } from "@/app/actions/analytics";
import TooltipWrapper from "./tooltip-wrapper";
import Analytics from "../analytics/main";

export default function ResumeViewer({ shortUrl }: { shortUrl: string }) {
  const { toast } = useToast();
  const router = useRouter();
  const { resumeData, fetchResumeData, isLoading, error } = useGetResumeData();
  const [isFullScreen, setIsFullScreen] = useState(false);
  // const { location, device } = useLocationBrowserData();

  const fetchResumeDataMemoized = useCallback(() => {
    if (shortUrl) {
      fetchResumeData({ shortUrl, operation: "ResumePreview" });
    }
  }, [fetchResumeData, shortUrl]);

  useEffect(() => {
    if (!resumeData) fetchResumeDataMemoized();
  }, [fetchResumeDataMemoized, shortUrl]);

  const trackDownload = async (event: string) => {
    await ClickEvent({ resume: shortUrl, event });
  };

  const handleDownload = () => {
    if (resumeData?.fileUrl) {
      const link = document.createElement("a");
      link.href = resumeData.fileUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      trackDownload("download");
      toast({
        title: "Resume Downloaded",
        description: "The resume has been downloaded to your device.",
      });
    } else {
      toast({
        title: "Download Failed",
        description: "The resume file is not available.",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    ClickEvent({ resume: shortUrl, event: "shares" });
    const shareData = {
      title: `${resumeData?.name}'s Resume`,
      text: `Check out ${resumeData?.name}'s Resume`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      await navigator.share(shareData);
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);

      toast({
        title: "Link Copied",
        description: "The resume link has been copied to your clipboard.",
      });
    } else {
      toast({
        title: "Unable to Share",
        description: "Your browser does not support sharing.",
        variant: "destructive",
      });
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen  p-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Skeleton className="w-full h-[600px] rounded-xl" />
            </div>
            <div className="space-y-4">
              <Skeleton className="w-full h-60 rounded-xl" />
              <Skeleton className="w-full h-60 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-4">
          <CardContent className="text-center p-4 space-y-2">
            <p className="text-gray-600">{error}</p>
            <Button onClick={() => router.push("/")} className="w-full">
              Explore ResumeOrg
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <Analytics shortUrl={shortUrl} />
      <div className="shadow-sm hidden border-b">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {resumeData?.name || "Professional Resume"}
                </h1>
                <p className="text-sm text-gray-500">Resume Viewer</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="hidden sm:flex"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl p-4">
        <div
          className={`grid gap-6 ${
            isFullScreen ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
          }`}
        >
          <div
            className={`${isFullScreen ? "col-span-full" : "lg:col-span-2"}`}
          >
            <Card className="overflow-hidden shadow-lg">
              <CardContent className="p-0 relative">
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <TooltipWrapper
                    title={isFullScreen ? "Minimize" : "Maximize"}
                  >
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={toggleFullScreen}
                      className="backdrop-blur-sm "
                    >
                      {isFullScreen ? (
                        <Minimize2 className="w-4 h-4" />
                      ) : (
                        <Maximize2 className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipWrapper>
                  <TooltipWrapper title="Download">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleDownload}
                      className=" backdrop-blur-sm "
                    >
                      <FileDown className="w-4 h-4" />
                    </Button>
                  </TooltipWrapper>
                </div>
                <div
                  className={`${
                    isFullScreen ? "h-[calc(100vh-120px)]" : "h-[600px]"
                  }`}
                >
                  <PdfViewer
                    fileUrl={shortUrl}
                    preview={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {!isFullScreen && (
            <div className="space-y-6">
              <Card className="overflow-hidden shadow-lg">
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="relative">
                      {/* <Image
                        src="/placeholder.svg?height=120&width=120"
                        alt="Profile Picture"
                        width={120}
                        height={120}
                        className="rounded-full mx-auto border-4 border-blue-100 shadow-lg"
                      /> */}
                    </div>

                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {resumeData?.name || "Name not available"}
                      </h2>
                    </div>

                    <div className="space-y-2 pt-2">
                      {resumeData?.email && (
                        <a
                          href={`mailto:${resumeData.email}`}
                          className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Mail className="w-4 h-4" />
                          <span className="text-sm">{resumeData.email}</span>
                        </a>
                      )}

                      {resumeData?.phone && (
                        <a
                          href={`tel:${resumeData.phone}`}
                          className="flex items-center justify-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          <span className="text-sm">{resumeData.phone}</span>
                        </a>
                      )}

                      {resumeData?.location && (
                        <div className="flex items-center justify-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span className="text-sm">{resumeData.location}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <Button
                      onClick={handleDownload}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Resume
                    </Button>

                    {resumeData?.portfolioUrl && (
                      <Button
                        onClick={() =>
                          window.open(resumeData.portfolioUrl, "_blank")
                        }
                        variant="outline"
                        className="w-full border-blue-200 text-blue-700 hover:bg-blue-50"
                      >
                        <Globe className="w-4 h-4 mr-2" />
                        View Portfolio
                      </Button>
                    )}

                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Resume
                    </Button>
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
