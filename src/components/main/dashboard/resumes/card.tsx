import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, ExternalLink, Eye } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IResume } from "@/models/resume";

interface ResumeCardProps {
  resume: IResume;
  searchQuery: string;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, isPublic: boolean) => void;
}

export function ResumeCard({ resume, searchQuery, onDelete }: ResumeCardProps) {
  const highlightText = (text, query) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, index) =>
      regex.test(part) ? (
        <span key={index} className="bg-primary text-white">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const SearchTitle = highlightText(resume.title, searchQuery);

  return (
    <Card className="w-full hover:bg-muted/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <ExternalLink className="h-4 w-4 text-primary" />
          </div>
          <Link
            className=" hover:text-rose-400"
            href={`/resume/resumes/${resume.shortUrl}`}
          >
            {/* <h3
              className={`font-semibold text-lg 
              ${isSearchMatch && "text-primary"}
              `}
            >
              {resume.title}
            </h3> */}
            {SearchTitle}
          </Link>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit Tags</DropdownMenuItem>
            <DropdownMenuItem>Move to Folder</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(resume?.shortUrl)}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-2">
          {resume.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Uploaded on {new Date(resume.createdAt).toLocaleDateString()}
        </p>
        <p className="flex items-center gap-x-3 justify-start text-muted-foreground">
          <Eye size={16} />
          {resume.analytics.views}
        </p>
      </CardContent>
      {/* <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Switch
            checked={resume.isPublic}
            onCheckedChange={() =>
              onToggleVisibility(resume.shortUrl, !resume.isPublic)
            }
          />
          <span className="text-sm text-muted-foreground">
            {resume.isPublic ? "Public" : "Private"}
          </span>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Zap className="h-4 w-4" />
          </Button>
          <Link href={`/dashboard/resumes/${resume.shortUrl}`}>
            <Button variant="ghost" size="icon">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardFooter> */}
    </Card>
  );
}
