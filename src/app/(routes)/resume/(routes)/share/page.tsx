"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Copy,
  Share2,
  Info,
  Link as Link2,
  X,
  Download,
  QrCode,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "@/hooks/use-toast";
import useResumes from "@/app/hooks/get-resumes";
import { useSearchParams } from "next/navigation";
import type { IResume } from "@/models/resume";

export default function SharePage() {
  const { resumes } = useResumes();
  const searchParams = useSearchParams();
  const [selectedResume, setSelectedResume] = useState<IResume | null>(null);
  const [ref, setRef] = useState("");
  const [showRefError, setShowRefError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [url, setUrl] = useState("");
  const [qrOpen, setQrOpen] = useState(false);

  useEffect(() => {
    if (resumes?.length && !selectedResume) {
      const first = resumes[0];
      setSelectedResume(first);
      setUrl(window.location.origin + "/" + first.shortUrl);
    }
  }, [resumes]);

  useEffect(() => {
    if (!selectedResume && resumes && searchParams.get("resume")) {
      const resume = resumes.find(
        (r: IResume) => r.shortUrl === searchParams.get("resume")
      );
      if (resume) {
        setSelectedResume(resume);
        setUrl(window.location.origin + "/" + resume.shortUrl);
      }
    }
  }, [searchParams, resumes]);

  const handleCopy = (link: string) => {
    navigator.clipboard.writeText(link);
    toast({ title: "Link Copied", description: "Copied to clipboard." });
  };

  const handleShare = async (link: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${selectedResume?.title} - Resume`,
          text: "Check out my resume!",
          url: link,
        });
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      handleCopy(link);
    }
  };

  const handleRefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    const valid = /^[a-zA-Z0-9_]*$/;
    if (valid.test(newVal) || newVal === "") {
      setRef(newVal);
      setShowRefError(false);
    } else {
      setShowRefError(true);
    }
  };

  const shortenUrl = async (url: string) => {
    setLoading(true);
    try {
      const res = await fetch("https://sj1.xyz/api", {
        method: "POST",
        headers: {
          Authorization: `Bearer quklnk_OQPmKajmPrjrsRGIuVzmVDtk`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ long: url }),
      });
      const { data } = await res.json();
      setShortUrl(data?.shortUrl ?? url);
    } catch {
      setShortUrl(url);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadQR = () => {
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
        const png = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `${selectedResume.title}_QR.png`;
        link.href = png;
        link.click();
      };
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 w-full">
      <div className="flex-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Select Resume</CardTitle>
            <CardDescription>
              Pick a resume to manage sharing options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Select
              value={selectedResume?.shortUrl ?? ""}
              onValueChange={(value) => {
                const found = resumes.find((r:IResume) => r.shortUrl === value);
                if (found) {
                  setSelectedResume(found);
                  setUrl(window.location.origin + "/" + found.shortUrl);
                  setShortUrl("");
                  setRef("");
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose resume" />
              </SelectTrigger>
              <SelectContent>
                {resumes.map((r:IResume) => (
                  <SelectItem key={r.shortUrl} value={r.shortUrl}>
                    {r.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedResume && (
              <p className="text-sm text-muted-foreground">
                Last updated:{" "}
                {new Date(selectedResume.updatedAt).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Share Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label>Shareable Link</Label>
              <div className="flex gap-2 items-center">
                <p className="text-sm break-all flex-1 text-muted-foreground">
                  {url}
                  {ref && (
                    <span className=" bg-secondary p-1 rounded-md">
                      ?ref={ref}
                    </span>
                  )}
                </p>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => handleCopy(`${url}${ref && "?ref=" + ref}`)}
                >
                  <Copy size={16} />
                </Button>
                <Button
                  size="icon"
                  onClick={() => handleShare(`${url}${ref && "?ref=" + ref}`)}
                >
                  <Share2 size={16} />
                </Button>
              </div>
            </div>

            <div className="space-y-1">
              <Label className="flex items-center gap-2 mb-2">
                Add Reference
                <div className="relative  group cursor-pointer">
                  <Info size={14} className=" text-gray-500" />
                  <div className="absolute left-6 -top-2  w-80 text-xs bg-background p-2 border rounded shadow-md z-10 hidden group-hover:block">
                    Add labels like ‘LinkedIn’, ‘Email’, or any label you want
                    to track to your links, so you can see where people found
                    your resume.
                  </div>
                </div>
              </Label>
              <Input
                placeholder="e.g. linkedin_message, email"
                value={ref}
                onChange={handleRefChange}
              />
              {showRefError && (
                <p className="text-xs text-red-500">
                  Only letters, numbers and underscores allowed.
                </p>
              )}
            </div>

            <div className="space-y-2">
              {shortUrl ? (
                <>
                  <Label>Short URL</Label>
                  <div className="flex items-center justify-between">
                    <p className="break-all text-sm text-muted-foreground">
                      {shortUrl}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => handleCopy(shortUrl)}
                      >
                        <Copy size={16} />
                      </Button>
                      <Button size="icon" onClick={() => handleShare(shortUrl)}>
                        <Share2 size={16} />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <Button
                  onClick={() => shortenUrl(`${url}${ref && "?ref=" + ref}`)}
                >
                  <Link2 size={20} />
                  {loading ? "Generating..." : "Generate Short URL"}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="w-full lg:max-w-sm flex flex-col space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>QR Code</CardTitle>
            <CardDescription>
              QR for the resume - &quot;{selectedResume?.title}&quot;
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {!qrOpen ? (
              <Button onClick={() => setQrOpen(!qrOpen)} className="mb-3">
                <QrCode />
                View QR Code
              </Button>
            ) : (
              <Button
                variant="secondary"
                onClick={() => setQrOpen(!qrOpen)}
                className="mb-3"
              >
                <X />
                Close
              </Button>
            )}
            <div
              className={` duration-300 overflow-hidden ${
                qrOpen ? "h-56" : "h-0 "
              }`}
            >
              {selectedResume && (
                <QRCodeSVG
                  id="qr-code"
                  value={`${url}?ref=owner-share-qrcode`}
                  size={192}
                />
              )}
            </div>
            <Button variant="outline" onClick={handleDownloadQR}>
              <Download />
              Download QR
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
