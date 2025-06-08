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
import { Zap, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FormEvent, useEffect, useState } from "react";
import axios from "axios";
import useResumes from "@/app/hooks/get-resumes";
import { IResume } from "@/models/resume";
import { useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";

export default function AIFeedbackPage() {
  const searchParams = useSearchParams();
  const { resumes } = useResumes();
  const [selectedResume, setSelectedResume] = useState<IResume | null>(null);
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState({ desc: "", shortUrl: "" });

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
      formData.append("firebaseUrl", selectedResume.fileUrl);
      formData.append("mode", "feedback");
      formData.append("responseLength", "medium");
      formData.append("query", role);

      const response = await axios.post(`/api/ai`, formData);
      setResult({
        desc: response.data.result,
        shortUrl: selectedResume.shortUrl,
      });
      if (error) {
      }
    } catch (err) {
      console.error(err);
      setError("Uh-oh! There was an error processing your request.");
    } finally {
      setIsLoading(false);
    }
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
              {/* <Badge variant="secondary">5 Credits Left</Badge>
              <Button size="sm">Buy Credits</Button> */}
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

      {selectedResume?.shortUrl === result?.shortUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              Generated Feedback for {selectedResume?.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-justify">
              <HighlightedText text={result.desc} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface HighlightedTextProps {
  text: string;
}

const HighlightedText: React.FC<HighlightedTextProps> = ({ text }) => {
  const items = text.split(/\n?\s*\d+\.\s+/).filter(Boolean);

  const renderHighlighted = (segment: string) => {
    const parts = segment.split(/(\*.*?\*|".*?")/g);

    return parts.map((part, i) => {
      const isAsteriskWrapped = part.startsWith("*") && part.endsWith("*");
      const isQuoteWrapped = part.startsWith('"') && part.endsWith('"');
      const endsWithColon = part.endsWith(":");

      if (isAsteriskWrapped) {
        return (
          <span key={i} className="font-semibold text-purple-600 -ml-[2px]">
            {part.slice(1, -1)}
          </span>
        );
      }

      if (isQuoteWrapped) {
        return (
          <span key={i} className="font-semibold text-pink-600">
            {part.slice(1, -1)}
          </span>
        );
      }

      if (part.startsWith("*") || part.startsWith('"')) {
        return <span key={i}>{part.slice(1)}</span>;
      }

      if (part.endsWith("*") || part.endsWith('"')) {
        return <span key={i}>{part.slice(0, -1)}</span>;
      }

      if (endsWithColon) {
        return (
          <span key={i} className="font-semibold">
            {part}
          </span>
        );
      }

      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => {
        const [heading, ...rest] = item.split(/(?<=:)|\n/);
        const description = rest.join(" ").trim();

        return (
          <div key={index}>
            <div className="font-semibold ">
              {renderHighlighted(heading.trim())}
            </div>
            <div className="pl-4 dark:text-gray-300 text-gray-800">
              {renderHighlighted(description)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
