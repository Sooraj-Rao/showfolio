"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, File, X, CheckCircle, AlertCircle, FileX } from "lucide-react";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { app } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import useResumes from "@/app/hooks/get-resumes";
import { useRouter } from "next/navigation";
import { truncateText } from "@/app/utils/truncate-text";

export default function UploadPage() {
  const storage = getStorage(app);
  const { toast } = useToast();
  const router = useRouter();
  const { resumes, fetchResumes } = useResumes();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [uploadStatus, setUploadStatus] = useState<{
    [key: string]: "idle" | "uploading" | "success" | "error";
  }>({});

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) return;

    for (const file of files) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setUploadStatus((prev) => ({ ...prev, [file.name]: "uploading" }));
      setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));

      const metadata = { contentType: file.type };
      const storageRef = ref(storage, `resumes/${file.name}-${Date.now()}`);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => ({ ...prev, [file.name]: progress }));
        },
        (error) => {
          console.error("Upload error:", error);
          setUploadStatus((prev) => ({ ...prev, [file.name]: "error" }));
          toast({
            title: "Error",
            description: `Failed to upload ${file.name}`,
            variant: "destructive",
          });
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setUploadStatus((prev) => ({ ...prev, [file.name]: "success" }));
          await saveResumeToDatabase(file.name, downloadURL, file.type);
          toast({
            title: "Success",
            description: `${file.name} uploaded successfully`,
          });
        }
      );
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus((prev) => ({ ...prev, [file.name]: "error" }));
      toast({
        title: "Error",
        description: `Failed to upload ${file.name}`,
        variant: "destructive",
      });
    }
  };

  const saveResumeToDatabase = async (
    title: string,
    fileUrl: string,
    fileType: string
  ) => {
    try {
      const response = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, fileUrl, fileType, operation: "create" }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to save resume to database");
      }
      setFiles([]);
      await fetchResumes();
      router.push(`/resume/resumes/${data?.shortUrl ? data?.shortUrl : ""}`);
    } catch (error) {
      console.error("Error saving resume to database:", error);
      toast({
        title: "Error",
        description: "Failed to save resume details",
        variant: "destructive",
      });
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const isUploading = files.some(
    (file) => uploadStatus[file.name] === "uploading"
  );

  return (
    <div className="  mx-auto space-y-8 p-2">
      <div>
        <h2 className="text-2xl  font-bold tracking-tight">Upload</h2>
        <p className="text-muted-foreground text-sm">
          Upload your new resumes here
        </p>
      </div>
      <div className=" grid sm:grid-cols-2 grid-cols-1">
        <Card className="border-2 border-dashed">
          <CardContent className="">
            {files.length === 0 ? (
              <div
                className={`flex flex-col items-center justify-center py-10 transition-colors ${
                  dragActive ? "bg-primary/5" : ""
                }`}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  const droppedFiles = Array.from(e.dataTransfer.files);
                  onDrop(droppedFiles);
                }}
              >
                <div className="bg-muted rounded-full p-4 mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Drag and drop your resume here
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  or click to browse files
                </p>
                <Input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                  id="resume-upload"
                  onChange={(e) => {
                    const selectedFiles = Array.from(e.target.files || []);
                    onDrop(selectedFiles);
                  }}
                />
                <Button asChild>
                  <Label htmlFor="resume-upload">Choose File</Label>
                </Button>
              </div>
            ) : (
              <div className="mt-8 space-y-4">
                <h4 className="text-sm font-semibold">Selected Files:</h4>
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-muted/30 p-3 rounded-lg text-sm"
                  >
                    <div className="flex items-center space-x-3 flex-grow">
                      <File className="h-5 w-5 text-muted-foreground" />
                      <span className="font-medium">{file.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      {uploadStatus[file.name] === "uploading" && (
                        <div className="w-32 flex items-center space-x-2">
                          <Progress
                            value={uploadProgress[file.name]}
                            className="h-2"
                          />
                          <span className="text-xs font-medium">
                            {Math.round(uploadProgress[file.name])}%
                          </span>
                        </div>
                      )}
                      {uploadStatus[file.name] === "success" && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {uploadStatus[file.name] === "error" && (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      {!isUploading && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => removeFile(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  onClick={handleUpload}
                  className="w-full mt-4"
                  disabled={files.some(
                    (file) => uploadStatus[file.name] === "uploading"
                  )}
                >
                  {files.some(
                    (file) => uploadStatus[file.name] === "uploading"
                  ) ? (
                    <div className="flex items-center space-x-2">
                      <span>Uploading...</span>
                      <Progress
                        value={
                          Object.values(uploadProgress).reduce(
                            (a, b) => a + b,
                            0
                          ) / files.length
                        }
                        className="w-20 h-2"
                      />
                    </div>
                  ) : (
                    <>
                      Upload {files.length}{" "}
                      {files.length === 1 ? "file" : "files"}
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        {resumes?.length !== 0 ? (
          <Card className=" bg-transparent border-none">
            <CardHeader className="">
              <CardTitle>Recently Uploaded Resumes</CardTitle>
            </CardHeader>
            <CardContent className=" p-0 sm:px-6">
              <ul className="space-y-3">
                {resumes?.map((resume) => (
                  <Link
                    className=" hover:text-rose-400 duration-200 rounded-md
                flex items-center gap-x-2  hover:border-primary/50 border
                "
                    href={`/resume/resumes/${resume.shortUrl}`}
                    key={resume._id as string}
                  >
                    <li className="flex items-center justify-between p-3 bg-muted/30 w-full rounded-lg text-sm">
                      <div className="flex items-center space-x-3">
                        <File className="h-5 w-5 text-primary mr-2" />
                        {truncateText(
                          resume?.title,
                          window.innerWidth > 400 ? 35 : 14
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(resume.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </li>
                  </Link>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center p-6   rounded-lg ">
            <FileX className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-sm ">No resumes uploaded yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
