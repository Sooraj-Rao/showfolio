"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Zap, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios"; // Ensure axios is imported
import useResumes from "@/app/hooks/get-resumes";
import { IResume } from "@/models/resume";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";

export default function AIFeedbackPage() {
  const searchParams = useSearchParams();
  const { resumes } = useResumes(); // Assuming the resumes are already in the store
  const [selectedResume, setSelectedResume] = useState<IResume | null>(null); // Store the selected resume
  const [role, setRole] = useState(""); // Store the role input by the user
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(""); // Store feedback result

  const processResume = async (e: FormEvent) => {
    e.preventDefault();

    if (!selectedResume) {
      setError("Please select a resume.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("firebaseUrl", selectedResume.fileUrl); // Sending Firebase URL instead of file
      formData.append("mode", "feedback"); // We assume feedback is the mode
      formData.append("responseLength", "medium"); // You can customize based on user input
      formData.append("query", role); // The query field (if applicable)

      const response = await axios.post(`/api/ai`, formData); // Adjusted endpoint as per your backend

      // Set the feedback result received from backend
      setResult(response.data.result);
      if (error) {
      }
    } catch (err) {
      console.error(err);
      setError("Uh-oh! There was an error processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatFeedback = (feedback: string) => {
    const sections = feedback.split("\n\n**");

    return sections.map((section, index) => {
      const [sectionTitle, ...sectionContent] = section.split(":");
      return (
        <div key={index} className="space-y-4">
          <h3 className="text-lg font-bold">
            {sectionTitle.replace("*", "").trim()}:
          </h3>
          <p>{sectionContent.join(":").trim()}</p>
        </div>
      );
    });
  };

  useEffect(() => {
    if (!selectedResume && resumes && searchParams.get("shortUrl")) {
      const resume = resumes.find(
        (r: IResume) => r.shortUrl === searchParams.get("shortUrl")
      );
      if (resume) setSelectedResume(resume);
    }
  }, [searchParams.get("shortUrl"), resumes]);

  return (
    <div className="space-y-6 p-3">
      <form className="space-y-6">
        <Card className="w-full  ">
          <CardHeader>
            <CardTitle className="text-xl">
              <span className=" mr-4">Generate Resume Feedback</span>
              <Badge variant="secondary">5 Credits Left</Badge>
              <Button size="sm">Buy Credits</Button>
            </CardTitle>

            <CardDescription>
              Get personalized feedback for your resume based on your target
              role
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="resume-select" className="font-medium">
                Select Resume
              </Label>
              <Select
                value={selectedResume?.fileUrl}
                onValueChange={(value) => {
                  const resume = resumes.find(
                    (r: IResume) => r.fileUrl === value
                  );
                  if (resume) setSelectedResume(resume);
                  setError(null);
                }}
              >
                <SelectTrigger id="resume-select" className="w-full">
                  <SelectValue placeholder="Choose a resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes.map((item, i) => (
                    <SelectItem key={i} value={item.fileUrl}>
                      {item.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role-input" className="font-medium">
                Target Role
              </Label>
              <Input
                id="role-input"
                placeholder="E.g., Junior Software Engineer, Data Analyst"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end pt-2">
            <Button
              onClick={processResume}
              disabled={isLoading || !selectedResume || !role}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Zap className="mr-2 h-4 w-4" />
                  Generate Feedback
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Feedback Result:</h3>
              {formatFeedback(result)}
              {/* <HighlightedText text={result} /> */}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
