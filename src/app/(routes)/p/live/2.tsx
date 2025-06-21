"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Github,
  Linkedin,
  Twitter,
  Moon,
  Sun,
  Search,
  Briefcase,
  GraduationCap,
  ArrowLeft,
  ExternalLink,
  Mail,
  MapPin,
  Trophy,
  Award,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { usePortfolioAnalyticsEnhanced } from "@/app/hooks/use-portfolio-analytics";
import { useSectionObserver } from "@/app/hooks/use-section-observer";

interface PortfolioData {
  personalInfo?: {
    name?: string;
    title?: string;
    bio?: string;
    email?: string;
    location?: string;
    phone?: string;
  };
  projects?: Array<{
    name: string;
    description: string;
    technology: string;
    imageUrl?: string;
    link?: string;
  }>;
  skills?: string[];
  workExperience?: Array<{
    position: string;
    company: string;
    startDate: string;
    endDate: string;
    description?: string;
  }>;
  education?: Array<{
    degree: string;
    field?: string;
    institution: string;
    startDate: string;
    endDate: string;
  }>;
  achievements?: Array<{
    description: string;
    link?: string;
  }>;
  certifications?: Array<{
    name: string;
    issuer: string;
    date: string;
    url?: string;
  }>;
  blogs?: Array<{
    title: string;
    description: string;
    date: string;
  }>;
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
}

export default function PortfolioWithAnalytics({
  portfolioData,
  loading,
}: {
  loading: boolean;
  portfolioData: PortfolioData | null;
}) {
  const [activeSection, setActiveSection] = useState("portfolio");
  const [activeBlogPost, setActiveBlogPost] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("latest");

  // Initialize analytics tracking
  const {
    trackClick,
    trackProjectView,
    trackExternalLink,
    trackSocialLink,
    trackResumeDownload,
  } = usePortfolioAnalyticsEnhanced();

  // Initialize section observer
  useSectionObserver();

  const hasData = (section: keyof PortfolioData) => {
    if (!portfolioData) return false;
    const data = portfolioData[section];
    if (Array.isArray(data)) {
      return (
        data.length > 0 &&
        data.some((item) => {
          if (typeof item === "string") return item.trim() !== "";
          return Object.values(item).some(
            (value) => value && value.toString().trim() !== ""
          );
        })
      );
    }
    if (typeof data === "object") {
      return Object.values(data).some(
        (value) => value && value.toString().trim() !== ""
      );
    }
    return false;
  };

  const filteredProjects =
    portfolioData?.projects?.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.technology.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "latest") {
      return b.name.localeCompare(a.name);
    }
    return a.name.localeCompare(b.name);
  });

  // Handle section navigation with analytics
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    trackClick(`navigation_${section}`, "navigation");
  };

  // Handle project click with analytics
  const handleProjectClick = (project: any) => {
    trackProjectView(project.name);
    if (project.link) {
      trackExternalLink(project.link, "projects");
      window.open(project.link, "_blank");
    }
  };

  // Handle social link click with analytics
  const handleSocialClick = (link: any) => {
    trackSocialLink(link.platform);
    window.open(link.url, "_blank");
  };

  // Handle resume download with analytics
  const handleResumeDownload = () => {
    trackResumeDownload();
    // Add your resume download logic here
  };

  // Handle external link clicks with analytics
  const handleExternalLink = (url: string, section = "general") => {
    trackExternalLink(url, section);
    window.open(url, "_blank");
  };

  const renderBlogPost = (blog: any, index: number) => {
    if (activeBlogPost === `blog-${index}`) {
      return (
        <div className="space-y-8">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => {
              setActiveBlogPost(null);
              trackClick("blog_back_button", "blog");
            }}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>

          <article className="space-y-6" id="blog-content">
            <h1 className="text-4xl font-bold">{blog.title}</h1>
            <p className="text-gray-400">
              Posted on {new Date(blog.date).toLocaleDateString()}
            </p>

            <div className="prose prose-invert max-w-none">
              {blog.description
                .split("\n")
                .map((paragraph: string, i: number) => {
                  const linkRegex = /\[([^\]]+)\]$$([^)]+)$$/g;
                  const parts = paragraph.split(linkRegex);

                  return (
                    <p key={i} className="mb-4">
                      {parts.map((part, j) => {
                        if (j % 3 === 1) {
                          const url = parts[j + 1];
                          return (
                            <a
                              key={j}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 underline"
                              onClick={() => handleExternalLink(url, "blog")}
                            >
                              {part}
                            </a>
                          );
                        } else if (j % 3 === 2) {
                          return null;
                        }
                        return part;
                      })}
                    </p>
                  );
                })}
            </div>
          </article>
        </div>
      );
    }
    return null;
  };

  const renderContent = () => {
    if (activeBlogPost) {
      const blogIndex = Number.parseInt(activeBlogPost.split("-")[1]);
      const blog = portfolioData?.blogs?.[blogIndex];
      if (blog) {
        return renderBlogPost(blog, blogIndex);
      }
    }

    switch (activeSection) {
      case "about":
        return (
          <div className="space-y-12" id="about-content">
            {portfolioData?.personalInfo?.bio && (
              <section className="space-y-4" id="bio">
                <h2 className="text-2xl font-bold">About Me</h2>
                <p className="text-gray-300 leading-relaxed">
                  {portfolioData.personalInfo.bio}
                </p>
              </section>
            )}

            {hasData("workExperience") && (
              <section className="space-y-4" id="experience">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  <h2 className="text-2xl font-bold">Work Experience</h2>
                </div>
                <div className="space-y-6">
                  {portfolioData?.workExperience?.map((exp, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="text-xl font-semibold">{exp.position}</h3>
                      <p className="text-gray-400">
                        {exp.company} | {exp.startDate} - {exp.endDate}
                      </p>
                      {exp.description && (
                        <p className="text-gray-300">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {hasData("achievements") && (
              <section className="space-y-4" id="achievements">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <h2 className="text-2xl font-bold">Achievements</h2>
                </div>
                <div className="space-y-4">
                  {portfolioData?.achievements?.map((achievement, index) => (
                    <div key={index} className="space-y-2">
                      <p className="text-gray-300">{achievement.description}</p>
                      {achievement.link && (
                        <a
                          href={achievement.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                          onClick={() =>
                            handleExternalLink(
                              achievement.link!,
                              "achievements"
                            )
                          }
                        >
                          View Achievement <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {hasData("education") && (
              <section className="space-y-4" id="education">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  <h2 className="text-2xl font-bold">Education</h2>
                </div>
                <div className="space-y-4">
                  {portfolioData?.education?.map((edu, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="text-xl font-semibold">
                        {edu.degree} {edu.field && `in ${edu.field}`}
                      </h3>
                      <p className="text-gray-400">
                        {edu.institution} | {edu.startDate} - {edu.endDate}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {hasData("certifications") && (
              <section className="space-y-4" id="certifications">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  <h2 className="text-2xl font-bold">Certifications</h2>
                </div>
                <div className="space-y-4">
                  {portfolioData?.certifications?.map((cert, index) => (
                    <div key={index} className="space-y-2">
                      <h3 className="text-xl font-semibold">{cert.name}</h3>
                      <p className="text-gray-400">
                        {cert.issuer} | {cert.date}
                      </p>
                      {cert.url && (
                        <a
                          href={cert.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1"
                          onClick={() =>
                            handleExternalLink(cert.url!, "certifications")
                          }
                        >
                          View Certificate <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        );

      case "blog":
        if (!hasData("blogs")) {
          return (
            <div className="text-center py-12" id="blog-empty">
              <p className="text-gray-400">No blog posts available</p>
            </div>
          );
        }
        return (
          <div className="space-y-6" id="blog-content">
            {portfolioData?.blogs?.map((blog, index) => (
              <Card
                key={index}
                className="bg-gray-900 border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors"
                onClick={() => {
                  setActiveBlogPost(`blog-${index}`);
                  trackClick(`blog_${blog.title}`, "blog");
                }}
              >
                <CardContent className="p-6 space-y-4">
                  <h2 className="text-2xl font-bold hover:text-gray-300">
                    {blog.title}
                  </h2>
                  <p className="text-sm text-gray-400">
                    Posted on {new Date(blog.date).toLocaleDateString()}
                  </p>
                  <p className="text-gray-300">
                    {blog.description.substring(0, 150)}...
                  </p>
                  <Button variant="secondary" size="sm">
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      default:
        if (!hasData("projects")) {
          return (
            <div className="text-center py-12" id="projects-empty">
              <p className="text-gray-400">No projects available</p>
            </div>
          );
        }
        return (
          <div id="projects-content">
            <div className="flex justify-between items-center mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search in Projects"
                  className="pl-10 bg-gray-900 border-gray-800"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value) {
                      trackClick(`search_${e.target.value}`, "projects");
                    }
                  }}
                />
              </div>
              <Select
                value={sortBy}
                onValueChange={(value) => {
                  setSortBy(value);
                  trackClick(`sort_${value}`, "projects");
                }}
              >
                <SelectTrigger className="w-32 bg-transparent border-gray-800">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              id="projects-grid"
            >
              {sortedProjects.map((project, index) => (
                <div
                  key={index}
                  className="bg-gray-900 rounded-lg overflow-hidden hover:bg-gray-800 transition-colors"
                  id={`project-${index}`}
                >
                  {project.imageUrl && (
                    <div className="relative h-48">
                      <Image
                        src={project.imageUrl || "/placeholder.svg"}
                        alt={project.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {project.name}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {project.description}
                    </p>
                    {project.technology && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technology
                          .split(",")
                          .map((tech, techIndex) => (
                            <span
                              key={techIndex}
                              className="px-2 py-1 bg-gray-800 rounded-md text-xs"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                      </div>
                    )}
                    {project.link && (
                      <div className="flex gap-3">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="gap-2"
                          onClick={() => handleProjectClick(project)}
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Project
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
          <p className="mt-4">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl">Portfolio data not found</p>
          <p className="text-gray-400 mt-2">
            Please check your portfolio setup
          </p>
        </div>
      </div>
    );
  }

  const availableSections = [
    { key: "portfolio", label: "Portfolio", condition: hasData("projects") },
    {
      key: "about",
      label: "About",
      condition:
        portfolioData.personalInfo?.bio ||
        hasData("workExperience") ||
        hasData("education") ||
        hasData("achievements") ||
        hasData("certifications"),
    },
    { key: "blog", label: "Blog", condition: hasData("blogs") },
  ].filter((section) => section.condition);

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Sidebar */}
      <div className="w-[400px] p-8 border-r border-gray-800" id="sidebar">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-48 h-48 rounded-full overflow-hidden mb-4 bg-gray-800">
            <Image
              src="/placeholder.svg?height=192&width=192"
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold mb-1">
            {portfolioData.personalInfo?.name || "Your Name"}
          </h1>
          <p className="text-gray-400 mb-4">
            {portfolioData.personalInfo?.title || "Your Title"}
          </p>

          {hasData("skills") && (
            <div
              className="flex flex-wrap justify-center gap-2 mb-6"
              id="skills"
            >
              {portfolioData.skills?.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-800 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          <Button
            variant="outline"
            className="mb-8"
            onClick={handleResumeDownload}
          >
            Resume
          </Button>
        </div>

        <div className="mb-8" id="contact-info">
          <h2 className="text-xl font-semibold mb-4">Contact Info</h2>
          <div className="space-y-3 text-gray-400">
            {portfolioData.personalInfo?.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{portfolioData.personalInfo.email}</span>
              </div>
            )}
            {portfolioData.personalInfo?.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{portfolioData.personalInfo.location}</span>
              </div>
            )}
            {portfolioData.personalInfo?.phone && (
              <div className="flex items-center gap-2">
                <span>📞</span>
                <span>{portfolioData.personalInfo.phone}</span>
              </div>
            )}
          </div>
        </div>

        {hasData("socialLinks") && (
          <div id="social-links">
            <h2 className="text-xl font-semibold mb-4">Social Links</h2>
            <div className="flex flex-wrap gap-4">
              {portfolioData.socialLinks?.map((link, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  onClick={() => handleSocialClick(link)}
                  title={link.platform}
                >
                  {link.platform.toLowerCase().includes("linkedin") && (
                    <Linkedin className="w-5 h-5" />
                  )}
                  {link.platform.toLowerCase().includes("github") && (
                    <Github className="w-5 h-5" />
                  )}
                  {link.platform.toLowerCase().includes("twitter") && (
                    <Twitter className="w-5 h-5" />
                  )}
                  {!["linkedin", "github", "twitter"].some((platform) =>
                    link.platform.toLowerCase().includes(platform)
                  ) && <ExternalLink className="w-5 h-5" />}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8" id="main-content">
        <div className="flex justify-between items-center mb-8">
          <nav className="flex gap-6" id="navigation">
            {availableSections.map((section) => (
              <Button
                key={section.key}
                variant="link"
                className={
                  activeSection === section.key ? "text-white" : "text-gray-400"
                }
                onClick={() => handleSectionChange(section.key)}
              >
                {section.label}
              </Button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => trackClick("theme_light", "theme")}
            >
              <Sun className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => trackClick("theme_dark", "theme")}
            >
              <Moon className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}
