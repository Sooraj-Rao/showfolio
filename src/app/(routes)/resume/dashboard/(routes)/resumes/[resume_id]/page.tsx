"use client";

import { useState, useEffect, useCallback, type KeyboardEvent } from "react";
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
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { IResume } from "@/models/resume";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DownloadResume } from "@/app/utils/download-file";
import { useZustandStore } from "@/zustand/store";
import Link from "next/link";

interface TagInputProps {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
}

function TagInput({ tags, setTags }: TagInputProps) {
  const [input, setInput] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
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
    <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md">
      {tags.map((tag) => (
        <span
          key={tag}
          className="flex text-sm items-center justify-between bg-muted text-muted-foreground px-3 py-1 rounded-md"
        >
          {tag}
          <Button
            variant="ghost"
            size="sm"
            className="ml-1 p-0 h-4 w-4"
            onClick={() => removeTag(tag)}
          >
            <X size={12} />
          </Button>
        </span>
      ))}
      <Input
        type="text"
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        className="flex-grow border-none focus:ring-0"
        placeholder="Add a tag..."
      />
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
      const response = await axios.put(`/api/resume/`, updatedResume);

      if (response.status !== 200) {
        throw new Error("Failed to update resume. Please try again.");
      }

      // setResume((prev) => (prev ? { ...prev, ...updateFields } : null));

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
        selectedResumes: [params.resume_id],
        operation: "delete",
      });

      toast({
        title: "Resume deleted successfully!",
        description: "Your resume has been deleted.",
      });

      router.push("/dashboard/resumes");
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

  if (!error && isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-muted-foreground" />
        <p className="ml-4">Loading resume details...</p>
      </div>
    );
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
              size="sm"
              variant="outline"
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => router.push("/dashboard/resumes")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {resume?.title}
            </h2>
            <p className="text-muted-foreground">
              Manage and view details of your resume.
            </p>
          </div>
        </div>
        <div className="flex gap-x-3 items-center justify-between">
          <a target="_blank" href={`/${resume?.shortUrl}`} rel="noreferrer">
            <Button size="sm">
              Live
              <span>
                <ExternalLink size={16} />
              </span>
            </Button>
          </a>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Share2 className="mr-2 h-4 w-4" />
                Share Resume
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => DownloadResume(resume?.fileUrl || "")}
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setIsDeleteDialogOpen(true)}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Resume
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <ResumeDetailsCard
          resume={resume}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          updateFields={updateFields}
          setUpdateFields={setUpdateFields}
          handleSave={handleSave}
        />

        <ResumePreviewCard resume={resume} />

        <AnalyticsCard resume={resume} />
        <AIFeedbackCard />
      </div>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

function ResumeDetailsCard({
  resume,
  isEditing,
  setIsEditing,
  updateFields,
  setUpdateFields,
  handleSave,
}: {
  resume: IResume | null;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  updateFields: {
    title: string;
    tags: string[];
    isPublic: boolean;
  };
  setUpdateFields: React.Dispatch<
    React.SetStateAction<{
      title: string;
      tags: string[];
      isPublic: boolean;
    }>
  >;
  handleSave: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Details</CardTitle>
        <CardDescription>View and edit your resume information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isEditing ? (
          <EditingForm
            updateFields={updateFields}
            setUpdateFields={setUpdateFields}
            setIsEditing={setIsEditing}
            handleSave={handleSave}
          />
        ) : (
          <ViewingDetails
            setIsEditing={setIsEditing}
            resume={resume}
            updateFields={updateFields}
          />
        )}
      </CardContent>
    </Card>
  );
}

function EditingForm({
  updateFields,
  setUpdateFields,
  setIsEditing,
  handleSave,
}: {
  updateFields: {
    title: string;
    tags: string[];
    isPublic: boolean;
  };
  setUpdateFields: React.Dispatch<
    React.SetStateAction<{
      title: string;
      tags: string[];
      isPublic: boolean;
    }>
  >;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  handleSave: () => void;
}) {
  const { title, tags, isPublic } = updateFields;
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="resumeName">Resume Name</Label>
        <Input
          id="resumeName"
          value={title}
          onChange={(e) =>
            setUpdateFields({ ...updateFields, title: e.target.value })
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="resumeTags">Tags</Label>
        <TagInput
          tags={tags}
          setTags={(newTags: string[]) =>
            setUpdateFields({ ...updateFields, tags: newTags })
          }
        />
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium">Visibility:</span>
        <Switch
          checked={isPublic}
          onCheckedChange={(checked) =>
            setUpdateFields({ ...updateFields, isPublic: checked })
          }
        />
      </div>
      <div className="flex justify-end space-x-2">
        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </>
  );
}

function ViewingDetails({
  resume,
  updateFields,
  setIsEditing,
}: {
  resume: IResume | null;
  setIsEditing: (val: boolean) => void;
  updateFields: {
    title: string;
    tags: string[];
    isPublic: boolean;
  };
}) {
  return (
    <>
      <DetailItem label="File Name" value={updateFields.title} />
      <DetailItem label="File Type" value={resume?.fileType} />
      <DetailItem
        label="Upload Date"
        value={new Date(resume?.createdAt ?? "").toLocaleDateString()}
      />
      <DetailItem
        label="Last Modified"
        value={new Date(resume?.updatedAt ?? "").toLocaleDateString()}
      />
      <div className="flex justify-between items-center">
        <span className="font-medium">Tags:</span>
        <div>
          {updateFields?.tags?.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="mr-1">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-medium">Visibility:</span>
        <Switch
          checked={updateFields.isPublic}
          onClick={() => setIsEditing(true)}
        />
      </div>
      <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
        <Pencil className="mr-2 h-3 w-3" />
        <p>Edit Details</p>
      </Button>
    </>
  );
}

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  return (
    <div className="flex justify-between">
      <span className="font-medium">{label}:</span>
      <span>{value}</span>
    </div>
  );
}

function ResumePreviewCard({ resume }: { resume: IResume | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Preview</CardTitle>
        <CardDescription>Preview your uploaded resume</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-center">
        <div className="w-full h-96 bg-slate-100 flex items-center justify-center">
          <embed className="h-full w-full" src={resume?.fileUrl}></embed>
        </div>
      </CardContent>
    </Card>
  );
}

function AnalyticsCard({ resume }: { resume: IResume | null }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Eye className="mr-2 h-5 w-5 text-blue-500" />
          Analytics
        </CardTitle>
        <CardDescription>
          View performance metrics for your resume
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnalyticsItem
          icon={<Eye className="mr-2 h-4 w-4 text-blue-500" />}
          label="Views"
          value={resume?.analytics.views}
        />
        <Separator />
        <AnalyticsItem
          icon={<Download className="mr-2 h-4 w-4 text-green-500" />}
          label="Downloads"
          value={resume?.analytics.clicks}
        />
      </CardContent>
    </Card>
  );
}

function AnalyticsItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | undefined;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <span className="text-2xl font-bold">{value}</span>
    </div>
  );
}

function AIFeedbackCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <FileText className="mr-2 h-5 w-5 text-rose-500" />
          AI Feedback
        </CardTitle>
        <CardDescription>
          Get AI-powered insights on your resume
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Link href={""}>
          <Button size="sm" className="w-full">
            <FileText className="mr-2 h-4 w-4" />
            Request Feedback
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function DeleteConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Are you sure you want to delete this resume?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            resume.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button size="sm" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" variant="destructive" onClick={onConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
