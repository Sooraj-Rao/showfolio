"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Eye,
  Calendar,
  Globe,
  Monitor,
  Download,
  Share2,
  ExternalLink,
  Filter,
  ChevronLeft,
  ChevronRight,
  Phone,
  ArrowUpRight,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import Flag from "react-world-flags";

export interface AnalyticsItem {
  countryCode: string;
  _id: string;
  resume: string;
  resumeName: string;
  resumeShortUrl: string;
  event: string;
  referrer: string | null;
  device: string;
  os: string;
  browser: string;
  city: string;
  country: string;
  region: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface AnalyticsDescProps {
  data: AnalyticsItem[];
}

export default function AnalyticsDesc({ data }: AnalyticsDescProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and search functionality
  const filteredData = useMemo(() => {
    if (!data) return [];

    let filtered = data;

    // Apply category filter
    if (filterBy !== "all") {
      filtered = filtered.filter((item) => {
        switch (filterBy) {
          case "views":
            return item.event.includes("view");
          case "downloads":
            return item.event.includes("download");
          case "shares":
            return item.event.includes("share");
          case "contacts":
            return item.event.includes("contact");
          case "mobile":
            return item.device === "mobile";
          case "desktop":
            return item.device === "desktop";
          case "tablet":
            return item.device === "tablet";
          default:
            return true;
        }
      });
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((item) => {
        const searchableFields = [
          item.event,
          item.referrer || "",
          item.device,
          item.os,
          item.browser,
          item.city,
          item.country,
          item.region,
          item.resumeName,
          new Date(item.createdAt).toLocaleDateString(),
          new Date(item.createdAt).toLocaleTimeString(),
        ];

        return searchableFields.some((field) =>
          field.toLowerCase().includes(query)
        );
      });
    }

    // Sort by most recent first
    return filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [data, searchQuery, filterBy]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, filterBy]);

  // Helper functions
  const getEventIcon = (event: string) => {
    if (event.includes("view"))
      return <Eye className="w-4 h-4 text-blue-600" />;
    if (event.includes("download"))
      return <Download className="w-4 h-4 text-green-600" />;
    if (event.includes("share"))
      return <Share2 className="w-4 h-4 text-orange-600" />;
    if (event.includes("contact"))
      return <Phone className="w-4 h-4 text-purple-600" />;
    return <Monitor className="w-4 h-4 text-gray-600" />;
  };

  const getEventBadge = (event: string) => {
    if (event.includes("view"))
      return (
        <Badge
          variant="secondary"
          className="bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200"
        >
          View
        </Badge>
      );
    if (event.includes("download"))
      return (
        <Badge
          variant="secondary"
          className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-200"
        >
          Download
        </Badge>
      );
    if (event.includes("share"))
      return (
        <Badge
          variant="secondary"
          className="bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-200"
        >
          Share
        </Badge>
      );
    if (event.includes("contact"))
      return (
        <Badge
          variant="secondary"
          className="bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-200"
        >
          Contact
        </Badge>
      );
    return <Badge variant="outline">{event}</Badge>;
  };

  const getDeviceIcon = (device: string) => {
    const iconClass = "w-4 h-4 text-muted-foreground";
    if (device === "mobile") return <span className="text-sm">📱</span>;
    if (device === "tablet") return <span className="text-sm">📱</span>;
    if (device === "desktop") return <Monitor className={iconClass} />;
    return <Monitor className={iconClass} />;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
    };
  };

  const getReferrerDisplay = (referrer: string | null) => {
    if (!referrer) return "Direct";
    if (referrer === "dev_testing") return "Development";
    if (referrer.includes("linkedin")) return "LinkedIn";
    if (referrer.includes("twitter") || referrer.includes("x.com"))
      return "Twitter/X";
    if (referrer.includes("facebook")) return "Facebook";
    if (referrer.includes("google")) return "Google";
    if (referrer.includes("github")) return "GitHub";
    return referrer.length > 20 ? referrer.substring(0, 20) + "..." : referrer;
  };

  return (
    <div className="w-full space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Filter className="w-5 h-5" />
            Analytics Details
          </CardTitle>
          <CardDescription>
            Detailed view of all analytics events with search and filtering
            capabilities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-2 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search by country, city, browser, event, resume name, date, or any field..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Events</SelectItem>
                <SelectItem value="views">Views Only</SelectItem>
                <SelectItem value="downloads">Downloads Only</SelectItem>
                <SelectItem value="shares">Shares Only</SelectItem>
                <SelectItem value="contacts">Contacts Only</SelectItem>
                <SelectItem value="mobile">Mobile Devices</SelectItem>
                <SelectItem value="desktop">Desktop Devices</SelectItem>
                <SelectItem value="tablet">Tablet Devices</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Showing {paginatedData.length} of {filteredData.length} events
              {searchQuery && ` for "${searchQuery}"`}
            </span>
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchQuery("")}
                className="text-xs"
              >
                Clear search
              </Button>
            )}
          </div>

          <div className="border  rounded-lg overflow-hidden">
            <div className="overflow-x-scroll">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[100px]">Event</TableHead>
                    <TableHead className="w-[140px]">Resume</TableHead>
                    <TableHead className="w-[120px]">Location</TableHead>
                    <TableHead className="w-[100px]">Device</TableHead>
                    <TableHead className="w-[120px]">Browser/OS</TableHead>
                    <TableHead className="w-[100px]">Source</TableHead>
                    <TableHead className="w-[140px]">Date/Time</TableHead>
                    <TableHead className="w-[80px] text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item) => {
                      const { date, time } = formatDate(item.createdAt);
                      return (
                        <TableRow key={item._id} className="hover:bg-muted/30">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getEventIcon(item.event)}
                              {getEventBadge(item.event)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span
                                className="font-medium text-sm truncate max-w-[120px]"
                                title={item.resumeName}
                              >
                                {item.resumeName}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="text-lg">
                                {item.countryCode ? (
                                  <Flag
                                    code={item?.countryCode}
                                    style={{ width: "40px" }}
                                  />
                                ) : (
                                  <Globe className="w-3 h-3" />
                                )}
                              </span>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">
                                  {item.city}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {item.country}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getDeviceIcon(item.device)}
                              <span className="text-sm capitalize">
                                {item.device}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">
                                {item.browser}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {item.os}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {item.referrer &&
                                item.referrer !== "dev_testing" && (
                                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                                )}
                              <span className="text-sm">
                                {getReferrerDisplay(item.referrer)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">
                                {date}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {time}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    {getEventIcon(item.event)}
                                    Analytics Event Details
                                  </DialogTitle>
                                  <DialogDescription>
                                    Complete information for this analytics
                                    event
                                  </DialogDescription>
                                </DialogHeader>

                                <div className="space-y-6">
                                  {/* Resume Information */}
                                  <div className="space-y-3">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                      <Eye className="w-5 h-5" />
                                      Resume Information
                                    </h3>
                                    <div className="p-4 bg-muted/30 flex justify-between rounded-lg space-y-3">
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                          Resume Name
                                        </label>
                                        <p className="text-lg font-semibold mt-1">
                                          {item.resumeName}
                                        </p>
                                      </div>
                                      <Link
                                        href={`/resume/resumes/${item.resumeShortUrl}`}
                                      >
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="flex items-center gap-1"
                                        >
                                          <ArrowUpRight className="w-3 h-3" />
                                          View Resume
                                        </Button>
                                      </Link>
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                      <Calendar className="w-5 h-5" />
                                      Event Information
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                          Event Type
                                        </label>
                                        <div className="mt-1">
                                          {getEventBadge(item.event)}
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                          Date & Time
                                        </label>
                                        <p className="text-sm mt-1">
                                          {formatDate(item.createdAt).date} at{" "}
                                          {formatDate(item.createdAt).time}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="space-y-3">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                      <Globe className="w-5 h-5" />
                                      Location Information
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                          Country
                                        </label>
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="text-lg">
                                            {item.countryCode ? (
                                              <Flag
                                                code={item?.countryCode}
                                                style={{ width: "40px" }}
                                              />
                                            ) : (
                                              <Globe className="w-3 h-3" />
                                            )}
                                          </span>
                                          <span className="text-sm font-medium">
                                            {item.country}
                                          </span>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                          Region
                                        </label>
                                        <p className="text-sm mt-1">
                                          {item.region}
                                        </p>
                                      </div>
                                      <div className="sm:col-span-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                          City
                                        </label>
                                        <p className="text-sm mt-1">
                                          {item.city}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Device & Browser Information */}
                                  <div className="space-y-3">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                      <Monitor className="w-5 h-5" />
                                      Device & Browser Information
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                          Device Type
                                        </label>
                                        <div className="flex items-center gap-2 mt-1">
                                          {getDeviceIcon(item.device)}
                                          <span className="text-sm font-medium capitalize">
                                            {item.device}
                                          </span>
                                        </div>
                                      </div>
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                          Operating System
                                        </label>
                                        <p className="text-sm mt-1">
                                          {item.os}
                                        </p>
                                      </div>
                                      <div className="sm:col-span-2">
                                        <label className="text-sm font-medium text-muted-foreground">
                                          Browser
                                        </label>
                                        <p className="text-sm mt-1">
                                          {item.browser}
                                        </p>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Referrer Information */}
                                  <div className="space-y-3">
                                    <h3 className="font-semibold text-lg flex items-center gap-2">
                                      <ExternalLink className="w-5 h-5" />
                                      Traffic Source
                                    </h3>
                                    <div className="p-4 bg-muted/30 rounded-lg">
                                      <div>
                                        <label className="text-sm font-medium text-muted-foreground">
                                          Referrer
                                        </label>
                                        <div className="mt-1">
                                          {item.referrer ? (
                                            <div className="flex items-center gap-2">
                                              <ExternalLink className="w-4 h-4 text-muted-foreground" />
                                              <span className="text-sm font-medium">
                                                {getReferrerDisplay(
                                                  item.referrer
                                                )}
                                              </span>
                                              {item.referrer.length > 20 && (
                                                <span className="text-xs text-muted-foreground">
                                                  (Full: {item.referrer})
                                                </span>
                                              )}
                                            </div>
                                          ) : (
                                            <Badge variant="outline">
                                              Direct Access
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2">
                          <Search className="w-8 h-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            {searchQuery
                              ? `No results found for "${searchQuery}"`
                              : "No analytics data available"}
                          </p>
                          {searchQuery && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSearchQuery("")}
                            >
                              Clear search
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          {filteredData.length > itemsPerPage && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredData.length)} of{" "}
                {filteredData.length} entries
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Summary */}
          {filteredData.length > 0 && (
            <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t">
              <span>Total events: {filteredData.length}</span>
              <span>
                Page {currentPage} of {totalPages}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
