"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, Share2, Eye, EyeOff } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import useResumes from "@/app/hooks/get-resumes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import type { IResume } from "@/models/resume";
import { updateResumePassword } from "@/app/actions/save-password";
import { checkResumePasswordProtection } from "./password";
import SharePortfolio from "./portfolio";
import { useZustandStore } from "@/zustand/store";

export default function SharePage() {
  const { resumes } = useResumes();
  const { userData } = useZustandStore();
  const [selectedResume, setSelectedResume] = useState<IResume | null>(null);
  const [isPasswordProtected, setIsPasswordProtected] = useState(false);
  const [password, setPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  useEffect(() => {
    if (resumes && resumes.length > 0 && !selectedResume) {
      setSelectedResume(resumes[0]);
      setIsPasswordProtected(resumes[0].passwordProtected);
    }
  }, [resumes, selectedResume]);

  useEffect(() => {
    if (selectedResume) {
      setIsPasswordProtected(selectedResume.passwordProtected);
      setPassword("");
      setHasChanges(false);
    }
  }, [selectedResume]);

  const handleCopyLink = () => {
    if (selectedResume) {
      navigator.clipboard.writeText(
        `${window.location.origin}/${selectedResume.shortUrl}`
      );
      toast({
        title: "Link Copied",
        description: "The shareable link has been copied to your clipboard.",
      });
    }
  };

  const handleDownloadQR = () => {
    if (selectedResume) {
      const svg = document.getElementById("qr-code");
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL("image/png");
          const downloadLink = document.createElement("a");
          downloadLink.download = `${selectedResume.title}_QR.png`;
          downloadLink.href = pngFile;
          downloadLink.click();
        };
        img.src = "data:image/svg+xml;base64," + btoa(svgData);
      }
    }
  };

  const handleShare = async () => {
    if (selectedResume && navigator.share) {
      try {
        await navigator.share({
          title: `${selectedResume.title} - Resume`,
          text: "Check out my resume!",
          url: `${window.location.origin}/${selectedResume.shortUrl}`,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      handleCopyLink();
    }
  };

  const togglePasswordProtection = () => {
    setIsPasswordProtected(!isPasswordProtected);
    setHasChanges(true);
  };

  const handleSavePassword = async () => {
    if (selectedResume) {
      setIsUpdatingPassword(true);
      const result = await updateResumePassword(
        selectedResume.shortUrl,
        password,
        isPasswordProtected
      );
      if (result.success) {
        toast({
          title: "Password Settings Updated",
          description: isPasswordProtected
            ? "Your resume is now password protected."
            : "Password protection has been removed from your resume.",
        });
        //  @ts-expect-error error here
        setSelectedResume({
          ...selectedResume,
          passwordProtected: isPasswordProtected,
        });
        setHasChanges(false);
      } else {
        toast({
          title: "Error",
          description:
            "Failed to update resume password settings. Please try again.",
          variant: "destructive",
        });
      }
      setIsUpdatingPassword(false);
    }
  };

  const checkPassword = async () => {
    if (!selectedResume) return;
    const result = await checkResumePasswordProtection(selectedResume.shortUrl);
    if (result.success && result.password) {
      setPassword(result.password);
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Share Your Work</h2>
        <p className="text-muted-foreground">
          Manage and share your resumes and portfolio with ease.
        </p>
      </div>

      <Tabs defaultValue="resume">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="resume">Resume</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>
        <TabsContent value="resume" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Select Resume to Share</CardTitle>
              <CardDescription>
                Choose a resume to generate a shareable link or QR code.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={selectedResume?.shortUrl.toString()}
                onValueChange={(value) => {
                  const resume = resumes?.find(
                    (r) => r.shortUrl.toString() === value
                  );
                  if (resume) {
                    setSelectedResume(resume);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes?.map((resume) => (
                    <SelectItem
                      key={resume.shortUrl}
                      value={resume.shortUrl.toString()}
                    >
                      {resume.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedResume && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Last modified:{" "}
                  {new Date(selectedResume.updatedAt).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Share Options</CardTitle>
              <CardDescription>
                Configure sharing settings for {selectedResume?.title}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="link">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="link">Shareable Link</TabsTrigger>
                  <TabsTrigger value="qr">QR Code</TabsTrigger>
                </TabsList>
                <TabsContent value="link" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Shareable Link</Label>
                    <div className="flex space-x-2">
                      <Input
                        value={
                          selectedResume
                            ? `${window.location.origin}/${selectedResume.shortUrl}`
                            : ""
                        }
                        readOnly
                      />
                      <Button size="icon" onClick={handleCopyLink}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button size="icon" onClick={handleShare}>
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Password Protection</Label>
                        <p className="text-sm text-muted-foreground">
                          Require a password to view this specific resume
                        </p>
                      </div>
                      <Switch
                        checked={isPasswordProtected}
                        onCheckedChange={togglePasswordProtection}
                      />
                    </div>
                    {isPasswordProtected && (
                      <div className="space-y-2">
                        <Label htmlFor="password">Set Password</Label>
                        <div className="flex space-x-2">
                          <div className="relative w-full">
                            <Input
                              type={isPasswordVisible ? "text" : "password"}
                              id="password"
                              value={password}
                              onChange={(e) => {
                                setPassword(e.target.value);
                                setHasChanges(true);
                              }}
                              placeholder="Enter a secure password"
                              className="pr-10"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={togglePasswordVisibility}
                            >
                              {isPasswordVisible ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    {isPasswordProtected &&
                      !password &&
                      selectedResume?.passwordProtected && (
                        <Button
                          onClick={checkPassword}
                          size="sm"
                          variant="link"
                        >
                          View Password
                        </Button>
                      )}
                    {hasChanges && (
                      <Button
                        size="sm"
                        disabled={
                          (isPasswordProtected && password.length <= 3) ||
                          isUpdatingPassword
                        }
                        onClick={handleSavePassword}
                      >
                        {isUpdatingPassword ? "Saving..." : "Save Changes"}
                      </Button>
                    )}
                  </div>
                </TabsContent>
                <TabsContent value="qr" className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-48 h-48 flex items-center justify-center">
                      {selectedResume && (
                        <QRCodeSVG
                          id="qr-code"
                          value={`${window.location.origin}/${selectedResume.shortUrl}`}
                          size={192}
                        />
                      )}
                    </div>
                  </div>
                  <Button className="w-full" onClick={handleDownloadQR}>
                    Download QR Code
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="portfolio">
          <SharePortfolio
            portfolio={userData?.portfolio ? userData.portfolio : null}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
