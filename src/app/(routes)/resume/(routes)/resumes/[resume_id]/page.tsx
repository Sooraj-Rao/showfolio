"use client";

import type React from "react";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Eye,
  Download,
  Share2,
  Pencil,
  Trash2,
  MoreVertical,
  FileText,
  Loader2,
  ArrowLeft,
  ExternalLink,
  X,
  Plus,
  TrendingUp,
  Calendar,
  Globe,
  Lock,
  Copy,
  BarChart3,
  Clock,
  Star,
  Settings,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { IResume } from "@/models/resume";
import axios from "axios";
import { DownloadResume } from "@/app/utils/download-file";
import { useZustandStore } from "@/zustand/store";
import Link from "next/link";
import PdfViewer from "./pdf";

interface TagInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

function TagInput({ tags, setTags }: TagInputProps) {
  const [input, setInput] = useState("");

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim()) {
      e.preventDefault();
      if (!tags.includes(input.trim())) {
        setTags([...tags, input.trim()]);
      }
      setInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="secondary"
            className="flex items-center gap-1"
          >
            {tag}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder="Add tags (press Enter)"
          className="flex-1"
        />
        <Button
          onClick={() => {
            if (input.trim() && !tags.includes(input.trim())) {
              setTags([...tags, input.trim()]);
              setInput("");
            }
          }}
          disabled={!input.trim()}
          size="sm"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function ResumeDetailsPage({
  params,
}: {
  params: { resume_id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();

  const [resume, setResume] = useState<IResume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { resumes, setResumes } = useZustandStore();
  const [updateFields, setUpdateFields] = useState({
    title: "",
    tags: [] as string[],
    isPublic: false,
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchResume = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `/api/resume/?shortUrl=${params?.resume_id}&operation=getone`
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch resume. Please try again.");
      }

      setResume(response.data);
      setUpdateFields({
        title: response.data.title,
        tags: response.data.tags,
        isPublic: response.data.isPublic,
      });
    } catch (err: unknown) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [params?.resume_id]);

  useEffect(() => {
    fetchResume();
  }, [fetchResume]);

  const handleError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        router.push("/auth/login");
      } else {
        setError(err.response?.data?.error || "An error occurred");
      }
    } else if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("An unexpected error occurred");
    }
  };

  const handleSave = async () => {
    try {
      if (!resume) return;
      const updatedResume = { shortUrl: resume.shortUrl, ...updateFields };
      const response = await axios.put(`/api/resume`, updatedResume);
      if (response.status !== 200) {
        throw new Error("Failed to update resume. Please try again.");
      }

      setResume((prev) => (prev ? { ...prev, ...updateFields } : null));

      const updatedResumes = resumes?.map((item) =>
        item.shortUrl === resume.shortUrl ? { ...item, ...updateFields } : item
      );

      setResumes(updatedResumes);
      setIsEditing(false);
      toast({ title: "Success", description: "Resume updated successfully." });
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        });
      }
    }
  };
  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await axios.post("/api/resume", {
        selectedResumes: params.resume_id,
        operation: "delete",
      });

      toast({
        title: "Resume deleted successfully!",
        description: "Your resume has been deleted.",
      });

      router.push("/resume/resumes");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast({
          title: "Error deleting resume",
          description: err.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const copyShareLink = async () => {
    const shareUrl = `${window.location.origin}/${resume?.shortUrl}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied!",
        description: "Resume share link copied to clipboard.",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  if (!error && isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex items-center gap-3">
          <Loader2 className="animate-spin h-6 w-6 text-blue-600" />
          <p className="text-gray-500">Loading resume details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Error Loading Resume</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-500">{error}</p>
            <Button
              variant="outline"
              onClick={() => router.push("/resume/resumes")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Resumes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold dark:text-gray-400 text-gray-700 ">
                {resume?.title}
              </h1>
              <p className="text-gray-500 flex items-center gap-2 mt-1">
                <Calendar className="h-4 w-4" />
                Created {new Date(resume?.createdAt ?? "").toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge
              variant={resume?.isPublic ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              {resume?.isPublic ? (
                <Globe className="h-3 w-3" />
              ) : (
                <Lock className="h-3 w-3" />
              )}
              {resume?.isPublic ? "Public" : "Private"}
            </Badge>

            <Button asChild>
              <a
                href={`/${resume?.shortUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Live
              </a>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Total Views
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {resume?.analytics?.views || 0}
                  </p>
                </div>
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Downloads</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {resume?.analytics?.downloads || 0}
                  </p>
                </div>
                <Download className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Shares</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {resume?.analytics?.shares || 0}
                  </p>
                </div>
                <Share2 className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Engagement Rate
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {resume?.analytics?.views
                      ? Math.round(
                          (((resume?.analytics?.downloads || 0) +
                            (resume?.analytics?.shares || 0)) /
                            resume.analytics.views) *
                            100
                        )
                      : 0}
                    %
                  </p>
                </div>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Last Updated
                  </p>
                  <p className="text-lg font-semibold ">
                    {new Date(resume?.updatedAt ?? "").toLocaleDateString()}
                  </p>
                </div>
                <Clock className="h-5 w-5 text-gray-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resume Preview */}
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Resume Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] border-t">
                  <PdfViewer fileUrl={resume?.shortUrl} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Resume Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="title">Resume Title</Label>
                      <Input
                        id="title"
                        value={updateFields.title}
                        onChange={(e) =>
                          setUpdateFields({
                            ...updateFields,
                            title: e.target.value,
                          })
                        }
                        placeholder="Enter resume title"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Tags</Label>
                      <TagInput
                        tags={updateFields.tags}
                        setTags={(newTags) =>
                          setUpdateFields({ ...updateFields, tags: newTags })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="visibility">Public Visibility</Label>
                        <p className="text-sm text-gray-500">
                          Allow others to view your resume
                        </p>
                      </div>
                      <Switch
                        id="visibility"
                        checked={updateFields.isPublic}
                        onCheckedChange={(checked) =>
                          setUpdateFields({
                            ...updateFields,
                            isPublic: checked,
                          })
                        }
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSave} className="flex-1">
                        Save Changes
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Title
                        </Label>
                        <p className="text-sm font-semibold">{resume?.title}</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-500">
                          Tags
                        </Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {resume?.tags?.length ? (
                            resume.tags.map((tag: string) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">
                              No tags added
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Visibility
                          </Label>
                          <p className="text-sm">
                            {resume?.isPublic ? "Public" : "Private"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(true)}
                      className="w-full"
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Settings
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={copyShareLink}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Resume Link
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() =>
                    DownloadResume(
                      `/api/resume-file?resume=${resume?._id}`,
                      `${resume?.title}.pdf`
                    )
                  }
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Link href={`/resume/ai/?shortUrl=${resume?.shortUrl}`}>
                    <BarChart3 className="h-4 w-4 mr-2" />
                    AI Feedback
                  </Link>
                </Button>

                <Separator />

                <Button
                  variant="destructive"
                  className="w-full justify-start"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Resume
                </Button>
              </CardContent>
            </Card>

            {/* <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>View to Download Rate</span>
                    <span className="font-medium">
                      {resume?.analytics?.views
                        ? Math.round(
                            ((resume?.analytics?.clicks || 0) /
                              resume.analytics.views) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="w-full  rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          resume?.analytics?.views
                            ? Math.round(
                                ((resume?.analytics?.clicks || 0) /
                                  resume.analytics.views) *
                                  100
                              )
                            : 0
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="text-sm ">
                  <p>💡 Tip: Add relevant tags to improve discoverability</p>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>

        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Resume</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete "{resume?.title}"? This action
                cannot be undone and will permanently remove your resume and all
                its analytics data.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Resume
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
