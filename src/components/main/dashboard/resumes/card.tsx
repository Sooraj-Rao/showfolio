import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, File } from "lucide-react";
import Link from "next/link";

import type { IResume } from "@/models/resume";
import { formatDistanceToNow } from "date-fns";

interface ResumeCardProps {
  resume: IResume;
  searchQuery: string;
}

export function ResumeCard({ resume, searchQuery }: ResumeCardProps) {
  const highlightText = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part: string, index: number) =>
      regex.test(part) ? (
        <span key={index} className="bg-primary text-white px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const SearchTitle = highlightText(resume.title, searchQuery);

  return (
    <Link className="group block" href={`/resume/resumes/${resume.shortUrl}`}>
      <Card className="h-full transition-all duration-200 border hover:border-primary/50 bg-card hover:bg-muted/30 shadow-sm hover:shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-start space-x-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
              <File className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0 ">
              <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2">
                {SearchTitle}
              </h3>
              <div className="flex items-center gap-3 mt-2">
                <Badge
                  variant={resume.isPublic ? "outline" : "destructive"}
                  className="text-xs"
                >
                  {resume.isPublic ? "Public" : "Private"}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pb-4">
          <div className="min-h-[2rem] flex flex-wrap gap-1.5">
            {resume?.tags?.map((tag: string) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs px-2 py-1"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>

        <CardFooter className="pt-s0 mt-asuto">
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              <span>{resume.analytics.views} views</span>
            </div>
            <div className="flex items-center gap-1">
              <p>
                <span className=" mr-1">Created</span>
                {formatDistanceToNow(new Date(resume.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
