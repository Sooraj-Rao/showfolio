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
import { Copy, Share2, Info, Link as Link2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import useResumes from "@/app/hooks/get-resumes";
import { useSearchParams } from "next/navigation";
import type { IResume } from "@/models/resume";
import { truncateText } from "@/app/utils/truncate-text";

export default function SharePage() {
  const { resumes } = useResumes();
  const searchParams = useSearchParams();
  const [selectedResume, setSelectedResume] = useState<IResume | null>(null);
  const [ref, setRef] = useState("");
  const [showRefError, setShowRefError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState("");
  const [url, setUrl] = useState("");

  useEffect(() => {
    if (resumes?.length && !selectedResume) {
      const first = resumes[0];
      setSelectedResume(first);
      setUrl(window.location.origin + "/r/" + first.shortUrl);
    }
  }, [resumes]);

  useEffect(() => {
    if (!selectedResume && resumes && searchParams.get("resume")) {
      const resume = resumes.find(
        (r: IResume) => r.shortUrl === searchParams.get("resume")
      );
      if (resume) {
        setSelectedResume(resume);
        setUrl(window.location.origin + "/r/" + resume.shortUrl);
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
          Authorization: `Bearer quklnk_vSNTKReEzojrQIIGaKQcCAEw`,
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

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Share Resumes</h2>
      </div>
      <div className="flex flex-col xl:flex-row gap-6 sm:py-6  w-full">
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
                  const found = resumes.find(
                    (r: IResume) => r.shortUrl === value
                  );
                  if (found) {
                    setSelectedResume(found);
                    setUrl(window.location.origin + "/r/" + found.shortUrl);
                    setShortUrl("");
                    setRef("");
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((r: IResume) => (
                    <SelectItem key={r.shortUrl} value={r.shortUrl}>
                      {truncateText(r.title, window.innerWidth > 400 ? 40 : 20)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedResume && (
                <p className="text-sm text-muted-foreground">
                  Last updated:
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
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <p className="text-sm break-all flex-1 text-muted-foreground">
                    {truncateText(url, window.innerWidth > 400 ? 40 : 25)}

                    <button
                    className=" px-1 underline"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        const button = e.target as HTMLButtonElement;
                        const span = button.previousSibling as HTMLSpanElement;

                        span!.textContent = url;
                        button.style.display = "none";
                      }}
                    >
                      more
                    </button>
                    {ref && (
                      <span className=" bg-secondary p-1 rounded-md">
                        ?ref={ref}
                      </span>
                    )}
                  </p>
                  <div className=" flex gap-x-4">
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleCopy(`${url}${ref && "?ref=" + ref}`)
                      }
                    >
                      <Copy size={16} />
                      Copy
                    </Button>
                    <Button
                      onClick={() =>
                        handleShare(`${url}${ref && "?ref=" + ref}`)
                      }
                    >
                      <Share2 size={16} />
                      Share
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="flex items-center gap-2 mb-2">
                  Add Reference
                  <div className="relative  group cursor-pointer">
                    <Info size={14} className=" text-gray-500" />
                    <div className="absolute sm:left-6 -top-2  sm:w-80 w-60 -left-10 text-xs bg-background p-2 border rounded shadow-md z-10 hidden group-hover:block">
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

              <div className="">
                <>
                  <Label className="">Short URL</Label>
                  <p className="text-sm text-muted-foreground mb-4">
                    In case the shared URL looks too long, you can generate a
                    shortened version below
                  </p>
                  {shortUrl ? (
                    <div className="flex items-center justify-between">
                      <p className="break-all text-sm text-muted-foreground">
                        {shortUrl}
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleCopy(shortUrl)}
                        >
                          <Copy size={16} />
                          Copy
                        </Button>
                        <Button onClick={() => handleShare(shortUrl)}>
                          <Share2 size={16} />
                          Share
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      disabled={loading}
                      onClick={() =>
                        shortenUrl(`${url}${ref && "?ref=" + ref}`)
                      }
                    >
                      <Link2 size={20} />
                      {loading ? "Generating..." : "Generate Short URL"}
                    </Button>
                  )}
                </>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
