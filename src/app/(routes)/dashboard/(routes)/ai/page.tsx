"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { FormEvent, useState } from "react";
import axios from "axios"; // Ensure axios is imported
import useResumes from "@/app/hooks/get-resumes";
import { IResume } from "@/models/resume";

export default function AIFeedbackPage() {
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
      // Create FormData to send to the backend (we are sending only the Firebase URL)
      const formData = new FormData();
      formData.append("firebaseUrl", selectedResume.fileUrl); // Sending Firebase URL instead of file
      formData.append("mode", "feedback"); // We assume feedback is the mode
      formData.append("responseLength", "medium"); // You can customize based on user input
      formData.append("query", role); // The query field (if applicable)

      const response = await axios.post(`/api/ai`, formData); // Adjusted endpoint as per your backend

      setResult(response.data.result); // Set the feedback result received from backend
    } catch (err) {
      console.error(err);
      setError("Uh-oh! There was an error processing your request.");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to parse and format the result
  const formatFeedback = (feedback: string) => {
    const sections = feedback.split("\n\n**"); // Split the feedback by sections

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">AI Feedback</h2>
          <p className="text-muted-foreground">
            Get AI-powered suggestions to improve your resume.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">5 Credits Left</Badge>
          <Button>Buy Credits</Button>
        </div>
      </div>
      <form>
        <Card>
          <CardHeader>
            <CardTitle>Generate Feedback</CardTitle>
            <CardDescription>
              Select a resume and target role to get personalized feedback.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Select
                value={selectedResume?.fileUrl} // Binding the selected resume's file URL to the select input
                onValueChange={(value) => {
                  const resume = resumes.find((r) => r.fileUrl === value);
                  if (resume) setSelectedResume(resume); // Set the selected resume from the dropdown
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select resume" />
                </SelectTrigger>
                <SelectContent>
                  {resumes?.map((item, i) => (
                    <SelectItem key={i} value={item.fileUrl}>
                      {item.title} {/* Display resume title */}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Enter the role looking for..."
                value={role}
                onChange={(e) => setRole(e.target.value)} // Update the role input
              />
            </div>
            <Button
              className="w-full"
              size="icon"
              onClick={processResume}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin mr-2 h-4 w-4" />
              ) : (
                <Zap className="mr-2 h-4 w-4" />
              )}
              {isLoading ? "Generating..." : "Generate Feedback"}
            </Button>
            {error && <div className="text-red-500 mt-2">{error}</div>}
          </CardContent>
        </Card>
      </form>

      <Card>
        <CardHeader>
          <CardTitle>Previous Feedback</CardTitle>
          <CardDescription>
            View feedback history for your resumes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {result ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Feedback Result:</h3>
              {formatFeedback(result)} {/* Format and display feedback */}
            </div>
          ) : (
            <p>No feedback generated yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
