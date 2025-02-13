"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import useGetResumeData from "@/app/hooks/use-getResumeData";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Download,
  Eye,
  Mail,
  Phone,
  Share2,
  Maximize2,
  FileDown,
} from "lucide-react";
import { useRouter } from "next/navigation";

const PDFViewer: React.FC<{ fileUrl: string }> = ({ fileUrl }) => {
  return (
    <div className="w-full h-[calc(100vh-200px)] min-h-[500px] rounded-lg overflow-hidden shadow-lg relative">
      <iframe
        src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
        loading="lazy"
        width="100%"
        height="100%"
        className="border-none"
        title="Resume PDF"
      />
    </div>
  );
};

function ContactForm({
  onSubmit,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">Contact</h2>
      <div>
        <Label htmlFor="name">Your Name</Label>
        <Input id="name" required />
      </div>
      <div>
        <Label htmlFor="email">Your Email</Label>
        <Input id="email" type="email" required />
      </div>
      <div>
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" required />
      </div>
      <Button type="submit" className="w-full">
        Send Message
      </Button>
    </form>
  );
}

export default function ResumeViewer({ shortUrl }: { shortUrl: string }) {
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
    toast({
      title: "Message Sent",
      description: "Your message has been sent to the resume owner.",
    });
  };

  const handleDownload = () => {
    if (resumeData?.fileUrl) {
      const link = document.createElement("a");
      link.href = resumeData.fileUrl;
      link.download = `${resumeData.name || "resume"}.pdf`;
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

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "The resume link has been copied to your clipboard.",
      });
    } else {
      toast({
        title: "Unable to Share",
        description: "Your browser does not support clipboard access.",
        variant: "destructive",
      });
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  if (isLoading) {
    return <Skeleton className="w-full h-screen" />;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => router.push("/dashboard/resumes")}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <Card className="overflow-hidden shadow-xl">
        <CardContent className="p-6">
          <div
            className={`grid ${
              isFullScreen ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
            } gap-6`}
          >
            {/* Resume Viewer */}
            <div
              className={`${
                isFullScreen ? "col-span-full" : "lg:col-span-2"
              } bg-white p-4 rounded-lg shadow relative`}
            >
              <PDFViewer fileUrl={resumeData?.fileUrl || ""} />
              <div className="absolute top-6 right-6 flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white"
                  onClick={toggleFullScreen}
                >
                  <Maximize2 className="w-4 h-4" />
                  <span className="sr-only">Toggle full screen</span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-white"
                  onClick={handleDownload}
                >
                  <FileDown className="w-4 h-4" />
                  <span className="sr-only">Download PDF</span>
                </Button>
              </div>
            </div>

            {/* Resume Details */}
            {!isFullScreen && (
              <div className="space-y-6 bg-white p-4 rounded-lg shadow">
                <div className="text-center">
                  <Image
                    src={"/placeholder.svg"}
                    alt="Profile Picture"
                    width={150}
                    height={150}
                    className="rounded-full mx-auto border-4 border-primary/20 shadow-lg"
                  />
                  <h1 className="text-2xl font-bold mt-4 text-gray-800">
                    {resumeData?.name || "Name not available"}
                  </h1>
                  <p className="text-muted-foreground">
                    {resumeData?.email || "Email not available"}
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-2">
                  {resumeData?.portfolioUrl && (
                    <Button
                      onClick={() => window.open(resumeData.portfolioUrl)}
                      className="bg-blue-500 hover:bg-blue-600"
                    >
                      <Eye className="w-4 h-4 mr-2" /> Portfolio
                    </Button>
                  )}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="border-blue-500 text-blue-500 hover:bg-blue-50"
                      >
                        <Mail className="w-4 h-4 mr-2" /> Contact
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <ContactForm onSubmit={handleContact} />
                    </DialogContent>
                  </Dialog>
                  <Button
                    onClick={handleDownload}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <Download className="w-4 h-4 mr-2" /> Download Resume
                  </Button>
                </div>
                <div className="flex flex-col items-center space-y-2">
                  <a
                    href={`mailto:${resumeData?.email}`}
                    className="flex items-center text-blue-500 hover:text-blue-600"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    <span>{resumeData?.email || "Email not available"}</span>
                  </a>
                  {resumeData?.phone && (
                    <a
                      href={`tel:${resumeData.phone}`}
                      className="flex items-center text-blue-500 hover:text-blue-600"
                    >
                      <Phone className="w-4 h-4 mr-2" />
                      <span>{resumeData.phone}</span>
                    </a>
                  )}
                </div>
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShare}
                    className="border-rose-500 text-rose-500 hover:bg-rose-50"
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="sr-only">Share resume</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
