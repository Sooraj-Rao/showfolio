/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  Briefcase,
  GraduationCap,
  ArrowLeft,
  ExternalLink,
  Mail,
  MapPin,
  Trophy,
  Award,
  PhoneCallIcon,
  Menu,
  X,
  Palette,
  Download,
  Send,
  Code,
  Database,
  Smartphone,
  Wrench,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/main/theme/theme-toggle";
import { usePortfolioAnalyticsEnhanced } from "@/app/hooks/use-portfolio-analytics";
import Link from "next/link";

export const themes = {
  emerald: {
    name: "Emerald",
    type: "solid",
    primary: "bg-emerald-600 dark:bg-emerald-500",
    primaryHover: "hover:bg-emerald-700 dark:hover:bg-emerald-600",
    accent: "text-emerald-600 dark:text-emerald-400",
    accentHover: "hover:text-emerald-700 dark:hover:text-emerald-300",
    border: "border-emerald-500/20",
    gradient:
      "bg-gradient-to-br from-emerald-600/10 to-emerald-800/5 dark:from-emerald-400/10 dark:to-emerald-600/5",
    cardBg: "bg-white/50  dark:bg-emerald-950/10",
    cardBorder: "border-gray-200/50 dark:border-gray-800",
  },
  rose: {
    name: "Rose",
    type: "solid",
    primary: "bg-rose-600 dark:bg-rose-500",
    primaryHover: "hover:bg-rose-700 dark:hover:bg-rose-600",
    accent: "text-rose-600 dark:text-rose-400",
    accentHover: "hover:text-rose-700 dark:hover:text-rose-300",
    border: "border-rose-500/20",
    gradient:
      "bg-gradient-to-br from-rose-600/10 to-rose-800/5 dark:from-rose-400/10 dark:to-rose-600/5",
    cardBg: "bg-white/50 dark:bg-rose-950/10",
    cardBorder: "border-gray-200/50 dark:border-gray-800",
  },
  violet: {
    name: "Violet",
    type: "solid",
    primary: "bg-violet-600 dark:bg-violet-500",
    primaryHover: "hover:bg-violet-700 dark:hover:bg-violet-600",
    accent: "text-violet-600 dark:text-violet-400",
    accentHover: "hover:text-violet-700 dark:hover:text-violet-300",
    border: "border-violet-500/20",
    gradient:
      "bg-gradient-to-br from-violet-600/10 to-violet-800/5 dark:from-violet-400/10 dark:to-violet-600/5",
    cardBg: "bg-white/50 dark:bg-violet-950/10",
    cardBorder: "border-gray-200/50 dark:border-gray-800",
  },
  sunset: {
    name: "Sunset",
    type: "gradient",
    primary: "bg-gradient-to-r from-orange-500 to-pink-500",
    primaryHover: "hover:from-orange-600 hover:to-pink-600",
    accent: "text-orange-600 dark:text-orange-400",
    accentHover: "hover:text-orange-700 dark:hover:text-orange-300",
    border: "border-orange-500/20",
    gradient:
      "bg-gradient-to-br from-orange-500/10 via-pink-500/8 to-red-500/5 dark:from-orange-400/10 dark:via-pink-400/8 dark:to-red-400/5",
    cardBg: "bg-white/50 dark:bg-orange-950/10",
    cardBorder: "border-gray-200/50 dark:border-gray-800",
  },
  ocean: {
    name: "Ocean",
    type: "gradient",
    primary: "bg-gradient-to-r from-blue-500 to-cyan-500",
    primaryHover: "hover:from-blue-600 hover:to-cyan-600",
    accent: "text-blue-600 dark:text-blue-400",
    accentHover: "hover:text-blue-700 dark:hover:text-blue-300",
    border: "border-blue-500/20",
    gradient:
      "bg-gradient-to-br from-blue-500/10 via-cyan-500/8 to-teal-500/5 dark:from-blue-400/10 dark:via-cyan-400/8 dark:to-teal-400/5",
    cardBg: "bg-white/50 dark:bg-blue-950/10",
    cardBorder: "border-gray-200/50 dark:border-gray-800",
  },
  forest: {
    name: "Forest",
    type: "gradient",
    primary: "bg-gradient-to-r from-green-500 to-emerald-500",
    primaryHover: "hover:from-green-600 hover:to-emerald-600",
    accent: "text-green-600 dark:text-green-400",
    accentHover: "hover:text-green-700 dark:hover:text-green-300",
    border: "border-green-500/20",
    gradient:
      "bg-gradient-to-br from-green-500/10 via-emerald-500/8 to-teal-500/5 dark:from-green-400/10 dark:via-emerald-400/8 dark:to-teal-400/5",
    cardBg: "bg-white/50 dark:bg-green-950/10",
    cardBorder: "border-gray-200/50 dark:border-gray-800",
  },
  aurora: {
    name: "Aurora",
    type: "mixed",
    primary: "bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500",
    primaryHover:
      "hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600",
    accent: "text-purple-600 dark:text-purple-400",
    accentHover: "hover:text-purple-700 dark:hover:text-purple-300",
    border: "border-purple-500/20",
    gradient:
      "bg-gradient-to-br from-purple-500/10 via-pink-500/8 to-indigo-500/5 dark:from-purple-400/10 dark:via-pink-400/8 dark:to-indigo-400/5",
    cardBg: "bg-white/50 dark:bg-green-950/10",
    cardBorder: "border-gray-200/50 dark:border-gray-800",
  },
  cosmic: {
    name: "Cosmic",
    type: "mixed",
    primary: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500",
    primaryHover:
      "hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600",
    accent: "text-indigo-600 dark:text-indigo-400",
    accentHover: "hover:text-indigo-700 dark:hover:text-indigo-300",
    border: "border-indigo-500/20",
    gradient:
      "bg-gradient-to-br from-indigo-500/10 via-purple-500/8 to-pink-500/5 dark:from-indigo-400/10 dark:via-purple-400/8 dark:to-pink-400/5",
    cardBg: "bg-white/50 dark:bg-indigo-950/10",
    cardBorder: "border-gray-200/50 dark:border-gray-800",
  },
  neon: {
    name: "Neon",
    type: "mixed",
    primary: "bg-gradient-to-r from-cyan-400 via-green-400 to-blue-500",
    primaryHover: "hover:from-cyan-500 hover:via-green-500 hover:to-blue-600",
    accent: "text-cyan-600 dark:text-cyan-400",
    accentHover: "hover:text-cyan-700 dark:hover:text-cyan-300",
    border: "border-cyan-500/20",
    gradient:
      "bg-gradient-to-br from-cyan-400/10 via-green-400/8 to-blue-500/5 dark:from-cyan-300/10 dark:via-green-300/8 dark:to-blue-400/5",
    cardBg: "bg-white/50 dark:bg-cyan-950/10",
    cardBorder: "border-gray-200/50 dark:border-gray-800",
  },
  fire: {
    name: "Fire",
    type: "mixed",
    primary: "bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500",
    primaryHover: "hover:from-red-600 hover:via-orange-600 hover:to-yellow-600",
    accent: "text-red-600 dark:text-red-400",
    accentHover: "hover:text-red-700 dark:hover:text-red-300",
    border: "border-red-500/20",
    gradient:
      "bg-gradient-to-br from-red-500/10 via-orange-500/8 to-yellow-500/5 dark:from-red-400/10 dark:via-orange-400/8 dark:to-yellow-400/5",
    cardBg: "bg-white/50 dark:bg-red-950/10",
    cardBorder: "border-gray-200/50 dark:border-gray-800",
  },
};

const skillCategoryIcons: Record<string, any> = {
  frontend: Code,
  backend: Database,
  mobile: Smartphone,
  tools: Wrench,
  languages: Code,
  frameworks: Code,
  databases: Database,
  devops: Wrench,
  design: Palette,
  other: Wrench,
};

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
  skills?: Record<string, string[]> | string[]; 
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
  theme?: string;
  imageUrl?: string;
  themeMode?: string;
  ref?: string;
  analytics?: boolean;
}

export default function ModernPortfolioWithAnalytics({
  portfolioData,
}: {
  portfolioData: PortfolioData | null;
}) {
  
  const [activeSection, setActiveSection] = useState("projects");
  const [activeBlogPost, setActiveBlogPost] = useState<string | null>(null);
  const [currentTheme, setCurrentTheme] = useState(
    portfolioData?.theme || "emerald"
  );
  const [themeMode, setthemeMode] = useState(
    portfolioData.themeMode || "light"
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isPreview = portfolioData.analytics === false;

  const { trackClick, trackProjectView, trackExternalLink, trackSocialLink } =
    usePortfolioAnalyticsEnhanced(isPreview);

  const theme = themes[currentTheme];

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

  const hasSkillsData = () => {
    if (!portfolioData?.skills) return false;
    if (Array.isArray(portfolioData.skills)) {
      return (
        portfolioData.skills.length > 0 &&
        portfolioData.skills.some((skill) => skill.trim() !== "")
      );
    }
    return (
      Object.keys(portfolioData.skills).length > 0 &&
      Object.values(portfolioData.skills).some((skills) => skills.length > 0)
    );
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    setIsMobileMenuOpen(false);
    trackClick(`navigation_${section}`, "navigation");
  };

  const handleProjectClick = (project: any) => {
    trackProjectView(project.name);

    if (project.link) {
      trackExternalLink(project.link, "projects");
      window.open(project.link, "_blank");
    }
  };

  const handleSocialClick = (link: any) => {
    trackSocialLink(link.platform);
    window.open(link.url, "_blank");
  };

  const handleExternalLink = (url: string, section = "general") => {
    trackExternalLink(url, section);
    window.open(url, "_blank");
  };

  const handleThemeChange = (newTheme: keyof typeof themes) => {
    setCurrentTheme(newTheme);
    trackClick(`theme_${newTheme}`, "theme");
  };

  const handleResumeDownload = () => {
    trackClick("resume_download", "resume");
  };

  const handleContactClick = () => {
    trackClick("contact_button", "contact");
    if (portfolioData?.personalInfo?.email) {
      window.open(`mailto:${portfolioData.personalInfo.email}`);
    }
  };

  const handlePhoneClick = () => {
    trackClick("phone_click", "contact");
  };

  const handleBlogPostClick = (blog: any, index: number) => {
    setActiveBlogPost(`blog-${index}`);
    trackClick(`blog_${blog.title}`, "blog");
  };

  const handleBlogBackClick = () => {
    setActiveBlogPost(null);
    trackClick("blog_back", "blog");
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    trackClick(
      `mobile_menu_${!isMobileMenuOpen ? "open" : "close"}`,
      "navigation"
    );
  };

  const handleSkillClick = (skill: string, category?: string) => {
    trackClick(`skill_${skill}`, category || "skills");
  };

  const handleAchievementClick = (achievement: any) => {
    trackClick(
      `achievement_${achievement.description.substring(0, 30)}`,
      "achievements"
    );
    handleExternalLink(achievement.link, "achievements");
  };

  const handleCertificationClick = (cert: any) => {
    trackClick(`certification_${cert.name}`, "certifications");
    handleExternalLink(cert.url, "certifications");
  };

  const renderBlogPost = (blog: any, index: number) => {
    if (activeBlogPost === `blog-${index}`) {
      return (
        <div
          className="space-y-8 animate-in slide-in-from-right duration-300"
          id="blog-post-content"
        >
          <Button
            variant="ghost"
            className="gap-2"
            onClick={handleBlogBackClick}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Button>

          <article className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight">
                {blog.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <time>{new Date(blog.date).toLocaleDateString()}</time>
              </div>
            </div>

            <div className="prose prose-neutral dark:prose-invert prose-lg max-w-none">
              {blog.description
                .split("\n")
                .map((paragraph: string, i: number) => (
                  <p key={i} className="mb-6 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
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
          <div
            className="space-y-16 animate-in fade-in duration-500"
            id="about-section"
          >
            {portfolioData?.personalInfo?.bio && (
              <section className="space-y-6" id="bio">
                <h2 className="text-2xl md:text-3xl font-bold">About Me</h2>
                <div className="max-w-4xl">
                  <p className="text-lg leading-relaxed text-muted-foreground">
                    {portfolioData.personalInfo.bio}
                  </p>
                </div>
              </section>
            )}

            <div className="grid lg:grid-cols-2 gap-16">
              {hasData("workExperience") && (
                <section className="space-y-8" id="experience">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${theme.primary}`}>
                      <Briefcase className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">Experience</h2>
                  </div>
                  <div className="space-y-8">
                    {portfolioData?.workExperience?.map((exp, index) => (
                      <div
                        key={index}
                        className="relative pl-8 border-l-2 border-border"
                      >
                        <div
                          className={`absolute -left-2 w-4 h-4 rounded-full ${theme.primary}`}
                        />
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold">
                            {exp.position}
                          </h3>
                          <p className={`font-medium ${theme.accent}`}>
                            {exp.company}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {exp.startDate} - {exp.endDate}
                          </p>
                          {exp.description && (
                            <p className="text-muted-foreground leading-relaxed">
                              {exp.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {hasData("education") && (
                <section className="space-y-8" id="education">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${theme.primary}`}>
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">Education</h2>
                  </div>
                  <div className="space-y-8">
                    {portfolioData?.education?.map((edu, index) => (
                      <div
                        key={index}
                        className="relative pl-8 border-l-2 border-border"
                      >
                        <div
                          className={`absolute -left-2 w-4 h-4 rounded-full ${theme.primary}`}
                        />
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold">
                            {edu.degree} {edu.field && `in ${edu.field}`}
                          </h3>
                          <p className={`font-medium ${theme.accent}`}>
                            {edu.institution}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {edu.startDate} - {edu.endDate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-16">
              {hasData("achievements") && (
                <section className="space-y-8" id="achievements">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${theme.primary}`}>
                      <Trophy className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">Achievements</h2>
                  </div>
                  <div className="space-y-6">
                    {portfolioData?.achievements?.map((achievement, index) => (
                      <div key={index} className="space-y-3">
                        <p className="text-muted-foreground leading-relaxed">
                          {achievement.description}
                        </p>
                        {achievement.link && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-2 ${theme.accentHover} p-0 h-auto`}
                            onClick={() => handleAchievementClick(achievement)}
                          >
                            View Achievement{" "}
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {hasData("certifications") && (
                <section className="space-y-8" id="certifications">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${theme.primary}`}>
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">Certifications</h2>
                  </div>
                  <div className="space-y-6">
                    {portfolioData?.certifications?.map((cert, index) => (
                      <div key={index} className="space-y-3">
                        <h3 className="text-lg font-semibold">{cert.name}</h3>
                        <p className={`${theme.accent}`}>{cert.issuer}</p>
                        <p className="text-sm text-muted-foreground">
                          {cert.date}
                        </p>
                        {cert.url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-2 ${theme.accentHover} p-0 h-auto`}
                            onClick={() => handleCertificationClick(cert)}
                          >
                            View Certificate{" "}
                            <ExternalLink className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        );

      case "skills":
        if (!hasSkillsData()) {
          return (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No skills data available
              </p>
            </div>
          );
        }

        const skillsData = portfolioData?.skills;
        const isOldFormat = Array.isArray(skillsData);

        return (
          <div
            className="space-y-12 animate-in fade-in duration-500"
            id="skills-section"
          >
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold">
                Skills & Expertise
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Technologies and tools I work with to bring ideas to life
              </p>
            </div>

            {isOldFormat ? (
              <div className="max-w-4xl mx-auto">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {(skillsData as string[]).map((skill, index) => (
                    <div
                      key={index}
                      className={`group relative p-3 rounded-lg ${theme.cardBg} border ${theme.cardBorder} hover:scale-105 transition-all duration-300 cursor-pointer`}
                      onClick={() => handleSkillClick(skill)}
                    >
                      <div className="text-center">
                        <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                          {skill}
                        </span>
                      </div>
                      <div
                        className={`absolute inset-0 rounded-lg ${theme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-6xl mx-auto space-y-12">
                {Object.entries(skillsData as Record<string, string[]>).map(
                  ([category, skills]) => {
                    const IconComponent =
                      skillCategoryIcons[category.toLowerCase()] || Code;
                    return (
                      <div
                        key={category}
                        className="space-y-6"
                        id={`skills-${category}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${theme.primary}`}>
                            <IconComponent className="w-5 h-5 text-white" />
                          </div>
                          <h2 className="text-2xl font-bold capitalize">
                            {category}
                          </h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {skills.map((skill, index) => (
                            <div
                              key={index}
                              className={`group relative p-3 rounded-lg ${theme.cardBg} border ${theme.cardBorder} hover:scale-105 transition-all duration-300 cursor-pointer`}
                              onClick={() => handleSkillClick(skill, category)}
                            >
                              <div className="text-center">
                                <span className="text-sm font-medium group-hover:text-foreground transition-colors">
                                  {skill}
                                </span>
                              </div>
                              <div
                                className={`absolute inset-0 rounded-lg ${theme.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>
        );

      case "blog":
        if (!hasData("blogs")) {
          return (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No blog posts available
              </p>
            </div>
          );
        }
        return (
          <div
            className="space-y-12 animate-in fade-in duration-500"
            id="blog-section"
          >
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold">Blog</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Thoughts, insights, and experiences from my journey
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
              {portfolioData?.blogs?.map((blog, index) => (
                <Card
                  key={index}
                  className={`group ${theme.cardBg} border ${theme.cardBorder} hover:scale-[1.02] transition-all duration-300 cursor-pointer overflow-hidden`}
                  onClick={() => handleBlogPostClick(blog, index)}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <time className="text-sm text-muted-foreground">
                          {new Date(blog.date).toLocaleDateString()}
                        </time>
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                      <h2 className="text-xl font-bold group-hover:text-foreground transition-colors line-clamp-2">
                        {blog.title}
                      </h2>
                      <p className="text-muted-foreground leading-relaxed line-clamp-3">
                        {blog.description.substring(0, 150)}...
                      </p>
                      <div
                        className={`w-full h-1 rounded-full ${theme.gradient}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      default:
        if (!hasData("projects")) {
          return (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No projects available
              </p>
            </div>
          );
        }
        return (
          <div
            className="space-y-12 animate-in fade-in duration-500"
            id="projects-section"
          >
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold">Projects</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {portfolioData?.projects?.map((project, index) => (
                <Card
                  key={index}
                  className={`group ${theme.cardBg}  border ${theme.cardBorder} hover:scale-[1.02] transition-all duration-300 overflow-hidden`}
                  id={`project-${index}`}
                >
                  {project.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={project.imageUrl || "/placeholder.svg"}
                        alt={project.name}
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-6 space-y-4">
                    <h3 className="text-xl font-bold group-hover:text-foreground transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                    {project.technology && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.technology
                          .split(",")
                          .map((tech, techIndex) => (
                            <Badge
                              key={techIndex}
                              variant="secondary"
                              className="text-xs px-2 py-1 bg-muted/50 cursor-pointer"
                              onClick={() =>
                                handleSkillClick(tech.trim(), "technology")
                              }
                            >
                              {tech.trim()}
                            </Badge>
                          ))}
                      </div>
                    )}
                    {project.link && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`gap-2 ${theme.accent} ${theme.accentHover} p-0 h-auto`}
                        onClick={() => handleProjectClick(project)}
                      >
                        View Project <ExternalLink className="w-4 h-4" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
    }
  };

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-2xl font-bold">Portfolio not found</p>
          <p className="text-muted-foreground">
            Please check your portfolio setup
          </p>
        </div>
      </div>
    );
  }

  const availableSections = [
    { key: "projects", label: "Projects", condition: hasData("projects") },
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
    { key: "skills", label: "Skills", condition: hasSkillsData() },
    { key: "blog", label: "Blog", condition: hasData("blogs") },
  ].filter((section) => section.condition);

  return (
    <div
      className={`min-h-screen bg-background text-foreground transition-all duration-500 ${theme?.gradient}`}
      id="portfolio-container"
    >
      <div
        className="lg:hidden sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border"
        id="mobile-header"
      >
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-muted">
              <img
                src={portfolioData.imageUrl || "/placeholder.svg"}
                alt="Profile"
                className="object-cover"
              />
            </div>
            <div>
              {portfolioData.personalInfo?.name && (
                <h1 className="text-lg font-bold">
                  {portfolioData.personalInfo.name}
                </h1>
              )}
              {portfolioData.personalInfo?.title && (
                <p className="text-sm text-muted-foreground">
                  {portfolioData.personalInfo.title}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ModeToggle
              setthemeMode={setthemeMode}
              themeMode={themeMode}
              title={true}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleMobileMenuToggle}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            className="border-t border-border bg-background/95 backdrop-blur-md"
            id="mobile-menu"
          >
            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-4 h-4" />
                <Select value={currentTheme} onValueChange={handleThemeChange}>
                  <SelectTrigger className="flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full ${theme.primary}`}
                      />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(themes).map(([key, theme]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${theme.primary}`}
                          />
                          {theme.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <nav className="grid grid-cols-2 gap-2" id="mobile-navigation">
                {availableSections.map((section) => (
                  <Button
                    key={section.key}
                    variant={
                      activeSection === section.key ? "default" : "ghost"
                    }
                    className={`justify-start ${
                      activeSection === section.key ? theme.primary : ""
                    }`}
                    onClick={() => handleSectionChange(section.key)}
                  >
                    {section.label}
                  </Button>
                ))}
              </nav>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button
                  size="sm"
                  className={`flex-1 gap-2 ${theme.primary}`}
                  onClick={handleResumeDownload}
                >
                  <Download className="w-4 h-4" />
                  Resume
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={handleContactClick}
                >
                  <Send className="w-4 h-4" />
                  Contact
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex">
        <nav
          className="hidden lg:flex fixed w-80 xl:w-96 p-8 border-r border-border flex-col min-h-screen top-0"
          id="desktop-sidebar"
        >
          <div className="flex-1 space-y-8">
            <div className="text-center space-y-6" id="profile-section">
              <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden bg-muted">
                <img
                  src={portfolioData.imageUrl || "/placeholder.svg"}
                  alt="Profile"
                  className="object-cover"
                />
              </div>
              {portfolioData.personalInfo?.name && (
                <h1 className="text-2xl font-bold">
                  {portfolioData.personalInfo.name}
                </h1>
              )}
              {portfolioData.personalInfo?.title && (
                <p className="text-muted-foreground">
                  {portfolioData.personalInfo.title}
                </p>
              )}
            </div>
            <div>
              {portfolioData?.analytics === false && (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Palette className="w-4 h-4" />
                    <Select
                      value={currentTheme}
                      onValueChange={handleThemeChange}
                    >
                      <SelectTrigger className="flex-1">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${theme.primary}`}
                          />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(themes).map(([key, theme]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              <div
                                className={`w-3 h-3 rounded-full ${theme.primary}`}
                              />
                              {theme.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <ModeToggle
                    setthemeMode={setthemeMode}
                    themeMode={themeMode}
                    title={true}
                  />
                  <br />
                  <Link
                    href={`/portfolio/settings?theme=${currentTheme}&themeMode=${themeMode}`}
                  >
                    <Button variant="destructive" className=" mt-4">
                      Save theme
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <div className="space-y-6">
              <div className="space-y-4" id="contact-section">
                <h2 className="text-lg font-semibold">Contact</h2>
                <div className="space-y-3 text-sm">
                  {portfolioData.personalInfo?.email && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span>{portfolioData.personalInfo.email}</span>
                    </div>
                  )}
                  {portfolioData.personalInfo?.location && (
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{portfolioData.personalInfo.location}</span>
                    </div>
                  )}
                  {portfolioData.personalInfo?.phone && (
                    <a
                      href={`tel:${portfolioData.personalInfo.phone}`}
                      className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={handlePhoneClick}
                    >
                      <PhoneCallIcon className="w-4 h-4" />
                      <span>{portfolioData.personalInfo.phone}</span>
                    </a>
                  )}
                </div>
              </div>

              {hasData("socialLinks") && (
                <div className="space-y-4" id="social-section">
                  <h2 className="text-lg font-semibold">Social</h2>
                  <div className="flex gap-3">
                    {portfolioData.socialLinks?.map((link, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="icon"
                        className="hover:bg-muted"
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
            <div className="flex gap-3 pt-6 border-t border-border">
              <Button
                className={`flex-1 gap-2 ${theme.primary} text-white`}
                onClick={handleResumeDownload}
              >
                <Download className="w-4 h-4" />
                Resume
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={handleContactClick}
              >
                <Send className="w-4 h-4" />
                Contact
              </Button>
            </div>
          </div>
        </nav>

        <div className="flex-1 lg:ml-[24rem] p-4 lg:p-8">
          <div
            className="hidden lg:flex justify-between items-center mb-12"
            id="desktop-navigation"
          >
            <nav className="flex gap-8">
              {availableSections.map((section) => (
                <Button
                  key={section.key}
                  variant="ghost"
                  className={`text-lg ${
                    activeSection === section.key
                      ? `${theme.accent} font-semibold`
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => handleSectionChange(section.key)}
                >
                  {section.label}
                </Button>
              ))}
            </nav>
          </div>

          <div className="max-w-7xl mx-auto" id="main-content">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}
