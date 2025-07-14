/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Mail,
  MapPin,
  Trophy,
  Award,
  Briefcase,
  GraduationCap,
  Code,
  User,
  FolderOpen,
  MessageSquare,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type T_PortfolioData = {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
  };
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
  workExperience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technology: string;
    link: string;
    imageUrl: string;
  }>;
  achievements: Array<{
    description: string;
    link: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    url: string;
  }>;
  blogs: Array<{
    title: string;
    date: string;
    description: string;
  }>;
};

export default function One({
  portfolioData,
}: {
  portfolioData: T_PortfolioData | null;
}) {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<number | null>(null);

  const homeRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const achievementsRef = useRef<HTMLElement>(null);
  const blogRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "home", ref: homeRef },
        { id: "about", ref: aboutRef },
        { id: "projects", ref: projectsRef },
        { id: "skills", ref: skillsRef },
        { id: "achievements", ref: achievementsRef },
        { id: "blog", ref: blogRef },
      ];

      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        if (section.ref.current) {
          const { offsetTop, offsetHeight } = section.ref.current;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hasData = (section: keyof T_PortfolioData) => {
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

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  const renderBlogContent = (blog: any) => {
    return blog.description.split("\n").map((paragraph: string, i: number) => {
      const linkRegex = /\[([^\]]+)\]$$([^)]+)$$/g;
      const parts = paragraph.split(linkRegex);

      return (
        <p key={i} className="mb-4 text-gray-600 leading-relaxed">
          {parts.map((part, j) => {
            if (j % 3 === 1) {
              const url = parts[j + 1];
              return (
                <a
                  key={j}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline font-medium"
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
    });
  };

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-800">
            Portfolio data not found
          </p>
          <p className="text-gray-600 mt-2">
            Please check your portfolio setup
          </p>
        </div>
      </div>
    );
  }

  const availableSections = [
    { key: "home", label: "Home", icon: User, ref: homeRef },
    {
      key: "about",
      label: "About",
      icon: User,
      ref: aboutRef,
      condition:
        portfolioData.personalInfo?.bio ||
        hasData("workExperience") ||
        hasData("education"),
    },
    {
      key: "projects",
      label: "Projects",
      icon: FolderOpen,
      ref: projectsRef,
      condition: hasData("projects"),
    },
    {
      key: "skills",
      label: "Skills",
      icon: Code,
      ref: skillsRef,
      condition: hasData("skills"),
    },
    {
      key: "achievements",
      label: "Achievements",
      icon: Trophy,
      ref: achievementsRef,
      condition: hasData("achievements"),
    },
    {
      key: "blog",
      label: "Blog",
      icon: MessageSquare,
      ref: blogRef,
      condition: hasData("blogs"),
    },
  ].filter((section) => section.condition !== false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {portfolioData.personalInfo?.name || "Portfolio"}
              </h1>
            </div>

            <nav className="hidden md:flex space-x-8">
              {availableSections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.key}
                    onClick={() => scrollToSection(section.ref)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeSection === section.key
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                {availableSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.key}
                      onClick={() => {
                        scrollToSection(section.ref);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeSection === section.key
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{section.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </header>

      <section
        ref={homeRef}
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="relative inline-block mb-8">
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-blue-200 shadow-xl">
              <Image
                src="/placeholder.svg?height=192&width=192"
                alt="Profile"
                width={192}
                height={192}
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-400 rounded-full border-4 border-white animate-pulse"></div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">
            {portfolioData.personalInfo?.name || "Your Name"}
          </h1>
          <p className="text-2xl md:text-3xl text-gray-600 mb-8">
            {portfolioData.personalInfo?.title || "Your Title"}
          </p>

          {portfolioData.personalInfo?.bio && (
            <p className="text-lg text-gray-700 max-w-3xl mx-auto mb-12 leading-relaxed">
              {portfolioData.personalInfo.bio}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <Button
              size="lg"
              onClick={() => scrollToSection(projectsRef)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 transform hover:scale-105 transition-all duration-300"
            >
              <FolderOpen className="mr-2 h-5 w-5" />
              View Projects
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection(aboutRef)}
              className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 transform hover:scale-105 transition-all duration-300"
            >
              <User className="mr-2 h-5 w-5" />
              About Me
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {portfolioData.personalInfo?.email && (
              <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Mail className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600 text-sm">
                    {portfolioData.personalInfo.email}
                  </p>
                </CardContent>
              </Card>
            )}

            {portfolioData.personalInfo?.location && (
              <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-8 h-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-1">Location</h3>
                  <p className="text-gray-600 text-sm">
                    {portfolioData.personalInfo.location}
                  </p>
                </CardContent>
              </Card>
            )}

            {portfolioData.personalInfo?.phone && (
              <Card className="hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <span className="text-3xl mb-3 block">📞</span>
                  <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                  <p className="text-gray-600 text-sm">
                    {portfolioData.personalInfo.phone}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {hasData("socialLinks") && (
            <div className="flex justify-center gap-4 mb-12">
              {portfolioData.socialLinks?.map((link, index) => (
                <button
                  key={index}
                  onClick={() => window.open(link.url, "_blank")}
                  className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                >
                  {link.platform.toLowerCase().includes("linkedin") && (
                    <Linkedin className="w-6 h-6" />
                  )}
                  {link.platform.toLowerCase().includes("github") && (
                    <Github className="w-6 h-6" />
                  )}
                  {link.platform.toLowerCase().includes("twitter") && (
                    <Twitter className="w-6 h-6" />
                  )}
                  {!["linkedin", "github", "twitter"].some((platform) =>
                    link.platform.toLowerCase().includes(platform)
                  ) && <ExternalLink className="w-6 h-6" />}
                </button>
              ))}
            </div>
          )}

          <div className="animate-bounce">
            <ChevronDown className="w-8 h-8 mx-auto text-gray-400" />
          </div>
        </div>
      </section>

      {(portfolioData.personalInfo?.bio ||
        hasData("workExperience") ||
        hasData("education") ||
        hasData("certifications")) && (
        <section ref={aboutRef} className="min-h-screen py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16 text-center">
              About Me
            </h2>

            {portfolioData.personalInfo?.bio && (
              <Card className="mb-12 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <User className="w-6 h-6 text-blue-600" />
                    Introduction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {portfolioData.personalInfo.bio}
                  </p>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {hasData("workExperience") && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                      Work Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {portfolioData.workExperience?.map((exp, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-blue-200 pl-6 pb-6 last:pb-0"
                        >
                          <h3 className="text-xl font-semibold text-gray-900">
                            {exp.position}
                          </h3>
                          <p className="text-blue-600 font-medium">
                            {exp.company}
                          </p>
                          <p className="text-gray-500 text-sm mb-3">
                            {exp.startDate} - {exp.endDate}
                          </p>
                          {exp.description && (
                            <p className="text-gray-700">{exp.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {hasData("education") && (
                <Card className="shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <GraduationCap className="w-6 h-6 text-blue-600" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {portfolioData.education?.map((edu, index) => (
                        <div
                          key={index}
                          className="border-l-4 border-green-200 pl-6 pb-6 last:pb-0"
                        >
                          <h3 className="text-xl font-semibold text-gray-900">
                            {edu.degree} {edu.field && `in ${edu.field}`}
                          </h3>
                          <p className="text-green-600 font-medium">
                            {edu.institution}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {edu.startDate} - {edu.endDate}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {hasData("certifications") && (
              <Card className="mt-8 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Award className="w-6 h-6 text-blue-600" />
                    Certifications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {portfolioData.certifications?.map((cert, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-all duration-300 transform hover:scale-105"
                      >
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {cert.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">
                          {cert.issuer}
                        </p>
                        <p className="text-gray-500 text-xs mb-3">
                          {cert.date}
                        </p>
                        {cert.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(cert.url, "_blank")}
                          >
                            <ExternalLink className="mr-1 h-3 w-3" />
                            View
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      )}

      {hasData("projects") && (
        <section ref={projectsRef} className="min-h-screen py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16 text-center">
              My Projects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioData.projects?.map((project, index) => (
                <Card
                  key={index}
                  className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                >
                  {project.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={project.imageUrl || "/placeholder.svg"}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {project.name}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                      {project.description}
                    </p>

                    {project.technology && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technology
                          .split(",")
                          .map((tech, techIndex) => (
                            <Badge
                              key={techIndex}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tech.trim()}
                            </Badge>
                          ))}
                      </div>
                    )}

                    {project.link && (
                      <Button
                        onClick={() => window.open(project.link, "_blank")}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white transform hover:scale-105 transition-all duration-300"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Project
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {hasData("skills") && (
        <section
          ref={skillsRef}
          className="min-h-screen py-20 bg-white flex items-center"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16 text-center">
              Skills & Technologies
            </h2>

            <Card className="shadow-xl">
              <CardContent className="p-12">
                <div className="flex flex-wrap justify-center gap-4">
                  {portfolioData.skills?.map((skill, index) => (
                    <div
                      key={index}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full font-medium shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 cursor-default"
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {hasData("achievements") && (
        <section
          ref={achievementsRef}
          className="min-h-screen py-20 bg-gray-50 flex items-center"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16 text-center">
              Achievements
            </h2>

            <div className="space-y-6">
              {portfolioData.achievements?.map((achievement, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  <CardContent className="p-6 flex items-start gap-4">
                    <Trophy className="w-8 h-8 text-yellow-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-gray-700 mb-3 text-lg">
                        {achievement.description}
                      </p>
                      {achievement.link && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(achievement.link, "_blank")
                          }
                        >
                          <ExternalLink className="mr-1 h-3 w-3" />
                          View Achievement
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {hasData("blogs") && (
        <section ref={blogRef} className="min-h-screen py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {selectedBlog !== null ? (
              <div>
                <Button
                  variant="outline"
                  onClick={() => setSelectedBlog(null)}
                  className="mb-6"
                >
                  ← Back to Blog
                </Button>

                <Card className="shadow-xl">
                  <CardContent className="p-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                      {portfolioData.blogs?.[selectedBlog]?.title}
                    </h1>
                    <p className="text-gray-500 mb-8 text-lg">
                      Published on{" "}
                      {new Date(
                        portfolioData.blogs?.[selectedBlog]?.date || ""
                      ).toLocaleDateString()}
                    </p>
                    <div className="prose max-w-none text-lg">
                      {portfolioData.blogs?.[selectedBlog] &&
                        renderBlogContent(portfolioData.blogs[selectedBlog])}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-16 text-center">
                  Blog Posts
                </h2>

                <div className="space-y-8">
                  {portfolioData.blogs?.map((blog, index) => (
                    <Card
                      key={index}
                      className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                      onClick={() => setSelectedBlog(index)}
                    >
                      <CardContent className="p-8">
                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                          {blog.title}
                        </h3>
                        <p className="text-gray-500 text-sm mb-4">
                          Published on{" "}
                          {new Date(blog.date).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                          {blog.description.substring(0, 200)}...
                        </p>
                        <Button
                          variant="outline"
                          className="transform hover:scale-105 transition-all duration-300"
                        >
                          Read More →
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
