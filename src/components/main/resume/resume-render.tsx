"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import useGetResumeData from "@/app/hooks/use-getResumeData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import PdfViewer from "@/app/(routes)/resume/(routes)/resumes/[resume_id]/pdf";
import { ClickEvent } from "@/app/actions/analytics";

interface ResumeViewerProps {
  shortUrl: string;
}

export default function ResumeViewer({ shortUrl }: ResumeViewerProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { resumeData, fetchResumeData, isLoading, error } = useGetResumeData();
  const [isFullScreen, setIsFullScreen] = useState(false);

  const fetchResumeDataMemoized = useCallback(() => {
    if (shortUrl) {
      fetchResumeData({ shortUrl, operation: "ResumePreview" });
    }
  }, [fetchResumeData, shortUrl]);

  useEffect(() => {
    fetchResumeDataMemoized();
  }, [fetchResumeDataMemoized]);

  const handleContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const contactData = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
      resumeOwner: resumeData?.name,
      timestamp: new Date().toISOString(),
    };

    console.log("📧 Contact form submitted:", contactData);

    toast({
      title: "Message Sent Successfully!",
      description: "Your message has been sent to the resume owner.",
    });
  };

  const trackDownload = async () => {
    await ClickEvent({ resume: shortUrl, event: "download" });
  };

  const handleDownload = () => {
    if (resumeData?.fileUrl) {
      trackDownload();

      const link = document.createElement("a");
      link.href = resumeData.fileUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

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
    const shareData = {
      title: `${resumeData?.name}'s Resume`,
      text: `Check out ${resumeData?.name}'s professional resume`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        console.log("📤 Resume shared via Web Share API");
      } catch {
        console.log("Share cancelled");
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      console.log("📋 Resume link copied to clipboard");
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
    console.log(
      `🖥️ Fullscreen mode: ${!isFullScreen ? "enabled" : "disabled"}`
    );
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600 flex items-center justify-center gap-2">
              <FileDown className="w-5 h-5" />
              Resume Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">{error}</p>
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard/resumes")}
              className="w-full"
            >
              Go Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="shadow-sm border-b">
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
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleDownload}
                    className=" backdrop-blur-sm "
                  >
                    <FileDown className="w-4 h-4" />
                  </Button>
                </div>
                <div
                  className={`${
                    isFullScreen ? "h-[calc(100vh-120px)]" : "h-[600px]"
                  }`}
                >
                  <PdfViewer fileUrl={shortUrl} preview={true} />
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
                      <p className="text-gray-600 font-medium">
                        {resumeData?.title || "Professional"}
                      </p>
                    </div>

                    {/* Contact Info */}
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
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h3>

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

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full border-green-200 text-green-700 hover:bg-green-50"
                        >
                          <Mail className="w-4 h-4 mr-2" />
                          Send Message
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <ContactForm
                          onSubmit={handleContact}
                          recipientName={resumeData?.name}
                        />
                      </DialogContent>
                    </Dialog>

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

interface ContactFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  recipientName?: string;
}

function ContactForm({ onSubmit, recipientName }: ContactFormProps) {
  return (
    <div className="space-y-6">
      <div className="text-center border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
        <p className="text-gray-600 mt-1">
          Send a message to {recipientName || "the resume owner"}
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
              Your Name *
            </Label>
            <Input
              id="name"
              required
              className="mt-1"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Your Email *
            </Label>
            <Input
              id="email"
              type="email"
              required
              className="mt-1"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div>
          <Label
            htmlFor="subject"
            className="text-sm font-medium text-gray-700"
          >
            Subject
          </Label>
          <Input
            id="subject"
            className="mt-1"
            placeholder="What's this about?"
          />
        </div>

        <div>
          <Label
            htmlFor="message"
            className="text-sm font-medium text-gray-700"
          >
            Message *
          </Label>
          <Textarea
            id="message"
            required
            className="mt-1 min-h-[120px]"
            placeholder="Write your message here..."
          />
        </div>

        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
          <Send className="w-4 h-4 mr-2" />
          Send Message
        </Button>
      </form>
    </div>
  );
}
