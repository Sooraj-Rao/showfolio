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
import { truncateText } from "@/app/utils/truncate-text";

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
    <div className="space-y-6 sm:p-3 p-1">
      <form className="space-y-6">
        <Card className="w-full   ">
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
              Generated Feedback for
              <span className="text-muted-foreground ml-1">
                &quot;
                {truncateText(
                  selectedResume.title,
                  window.innerWidth > 500 ? 50 : 25
                )}
                &quot;
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 sm:text-justify">
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
  const renderHighlighted = (segment: string) => {
    // Clean the text first - remove extra asterisks and clean up formatting
    const cleanedSegment = segment.replace(/\*\*/g, '*'); // Convert ** to single *
    
    const parts = cleanedSegment.split(/(\*[^*]+\*|"[^"]+"|[^:]+:(?=\s))/g);
    
    return parts.map((part, i) => {
      if (!part.trim()) return null;
      
      const isAsterisk = part.startsWith("*") && part.endsWith("*") && part.length > 2;
      const isQuote = part.startsWith('"') && part.endsWith('"');
      const isHeading = part.endsWith(":") && !part.includes("\n");

      if (isAsterisk) {
        return (
          <span key={i} className="font-semibold dark:text-purple-400 text-purple-700">
            {part.slice(1, -1)}
          </span>
        );
      }

      if (isQuote) {
        return (
          <span key={i} className="font-semibold dark:text-pink-400 text-pink-700">
            {part.slice(1, -1)}
          </span>
        );
      }

      if (isHeading && part.length < 50) { // Only short headings
        return (
          <span key={i} className="font-semibold dark:text-blue-400 text-blue-700">
            {part}
          </span>
        );
      }

      return <span key={i}>{part}</span>;
    }).filter(Boolean);
  };

  // First, clean up the text thoroughly
  const cleanText = text
    .replace(/\*\*([^*]+)\*\*/g, '*$1*') // Convert ** to single *
    .replace(/\n\s*\n\s*\n/g, '\n\n') // Remove excessive line breaks
    .replace(/\s+6\.\s*$/, '') // Remove trailing "6." 
    .replace(/^\s*\*\s*/, '') // Remove leading bullets
    .trim();

  // Split into main sections and score section
  const scoreMatch = cleanText.match(/(Resume Score: \d+\/\d+[\s\S]*)/);
  const scoreSection = scoreMatch?.[1] || '';
  const mainContent = scoreSection ? cleanText.replace(scoreSection, '').trim() : cleanText;

  // Split main content into numbered sections and clean each one
  const sections = mainContent
    .split(/(?=\d+\.\s+[A-Z][^:]*:)/)
    .filter(section => section.trim())
    .map(section => {
      // Remove any trailing numbers or extra formatting
      return section
        .replace(/\s+\d+\.\s*$/, '') // Remove trailing numbers like "6."
        .replace(/^\s*\*\s*/, '') // Remove leading asterisks
        .trim();
    })
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Main Feedback Sections */}
      {sections.map((section, index) => {
        const trimmedSection = section.trim();
        if (!trimmedSection) return null;

        // Extract the numbered title and content
        const titleMatch = trimmedSection.match(/^(\d+\.\s+[^:]+:)/);
        if (!titleMatch) {
          // If no numbered title, render as-is
          return (
            <div key={index} className="">
              {renderHighlighted(trimmedSection)}
            </div>
          );
        }

        const title = titleMatch[1];
        const content = trimmedSection.replace(title, '').trim();

        return (
          <div key={index} className="space-y-3">
            <h3 className="text-lg font-semibold  border-b border-gray-700 pb-1">
              {title}
            </h3>
            <div className=" leading-relaxed pl-2">
              {renderHighlighted(content)}
            </div>
          </div>
        );
      })}

      {/* Resume Score Section */}
      {scoreSection && (() => {
        const scoreMatch = scoreSection.match(/Resume Score:\s*(\d+\/\d+)/);
        const scoreValue = scoreMatch?.[1] || '';
        
        // Extract bullet points - look for lines starting with * and clean them
        const bulletPoints = scoreSection
          .split('\n')
          .filter(line => line.trim().startsWith('*'))
          .map(line => line.replace(/^\s*\*+\s*/, '').trim()) // Remove all leading asterisks
          .filter(Boolean);

        return (
          <div className="space-y-4 mt-8  rounded-lg  ">
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-blue-400">
                Resume Score: {scoreValue}
              </h3>
            </div>
            
            {bulletPoints.length > 0 && (
              <ul className="space-y-2">
                {bulletPoints.map((point, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <span className="text-blue-400 mt-1">•</span>
                    <span className=" flex-1">
                      {renderHighlighted(point)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })()}
    </div>
  );
};



