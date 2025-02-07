"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Grid } from "@/components/ui/grid";
import { InfoIcon, Loader2, PlusIcon } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ResumeCard } from "@/components/main/dashboard/resumes/card";
import useResumes from "@/app/hooks/get-resumes";

type SortOption = "name" | "date" | "views";

export default function ResumesPage() {
  // const { userData } = useZustandStore();
  // const { loadingUserData } = useGetUserData();
  const { resumes, fetchError, loadingResumes, fetchResumes } = useResumes();
  const [selectedResumes, setSelectedResumes] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("date");
  const [filterFolder, setFilterFolder] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    // const searchParams = new URLSearchParams(window.location.search);
    // const redirect = searchParams.get("redirect");
    // const fetchData = searchParams.get("fetchData");
    // if (redirect === "true" && fetchData === "true") {
    // }
  }, []);

  const toggleResumeSelection = (id: string) => {
    setSelectedResumes((prev) =>
      prev.includes(id)
        ? prev.filter((resumeId) => resumeId !== id)
        : [...prev, id]
    );
  };

  const DeleteSelectedResumes = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await axios.post("/api/resume", {
        selectedResumes,
        operation: "delete",
      });
      if (response.status === 200) {
        fetchResumes();
        setSelectedResumes([]);
        setIsDeleteDialogOpen(false);
        toast({
          title: "Success",
          description: `Successfully deleted ${response.data.deletedCount} resume(s)`,
        });
      }
    } catch (error) {
      console.error("Error deleting resumes:", error);
      toast({
        title: "Error",
        description: "Failed to delete selected resumes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredAndSortedResumes = useMemo(() => {
    return resumes
      ?.filter((resume) => {
        const matchesSearch = resume?.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesFolder =
          filterFolder === "all" || resume?.folder === filterFolder;
        return matchesSearch && matchesFolder;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.title.localeCompare(b.title);
          case "date":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "views":
            return b.analytics.views - a.analytics.views;
          default:
            return 0;
        }
      });
  }, [resumes, searchQuery, filterFolder, sortBy]);

  if (loadingResumes) {
    return <ResumeCardSkeleton />;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Resumes</h2>
          <p className="text-muted-foreground">
            Manage and organize your resumes.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/dashboard/upload">
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Upload New Resume
            </Button>
          </Link>
        </div>
      </div>
      {resumes.length > 0 && (
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resumes..."
            className="max-w-sm"
          />
          <Select value={filterFolder} onValueChange={setFilterFolder}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by folder" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Folders</SelectItem>
              <SelectItem value="tech">Tech</SelectItem>
              <SelectItem value="management">Management</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortOption)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="date">Upload Date</SelectItem>
              <SelectItem value="views">Most Views</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {filteredAndSortedResumes?.length === 0 ? (
        <div className="bg-primary/5 p-4 rounded-md flex items-center justify-center">
          <InfoIcon className="mr-2" size={18} />
          <p>{searchQuery ? "No matching resumes found" : "No resumes yet"}</p>
        </div>
      ) : (
        <Grid className="gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredAndSortedResumes?.map((resume) => (
            <ResumeCard
              key={resume?.shortUrl}
              resume={resume}
              onDelete={(id) => {
                setSelectedResumes([id]);
                DeleteSelectedResumes();
              }}
              onToggleVisibility={(id, isPublic) => {
                // Implement visibility toggle logic here
                console.log(`Toggle visibility for ${id} to ${isPublic}`);
              }}
            />
          ))}
        </Grid>
      )}

      {selectedResumes.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-background shadow-lg rounded-lg p-4 flex items-center space-x-4">
          <Button variant="outline">Move to Folder</Button>
          <Button variant="outline">Share Selected</Button>
          <Button onClick={DeleteSelectedResumes} variant="destructive">
            Delete Selected
          </Button>
        </div>
      )}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete the selected resumes?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              selected resumes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function ResumeCardSkeleton() {
  return (
    <Grid className="gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="space-y-3">
          <div className="w-full h-40 bg-muted rounded-lg animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
          </div>
        </div>
      ))}
    </Grid>
  );
}
