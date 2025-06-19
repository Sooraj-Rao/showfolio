"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Github,
  Linkedin,
  Twitter,
  Mail,
  MapPin,
  Phone,
  ExternalLink,
  Calendar,
  GraduationCap,
  Award,
  User,
  Briefcase,
  Code,
} from "lucide-react";

interface PortfolioData {
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
}

interface PortfolioTemplate1Props {
  data?: PortfolioData;
}

export default function PortfolioTemplate1({ data }: PortfolioTemplate1Props) {
  const [activeSection, setActiveSection] = useState("about");
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null
  );

  // Demo data
  const demoData: PortfolioData = {
    personalInfo: {
      name: "SOORAJ",
      title: "Full Stack Developer",
      email: "soorajrao.in@gmail.com",
      phone: "+91 8792688951",
      location: "Mangalore, Karnataka, India",
      bio: "Passionate full-stack developer with expertise in modern web technologies. I love creating innovative solutions and bringing ideas to life through clean, efficient code.",
    },
    socialLinks: [
      { platform: "LinkedIn", url: "https://linkedin.com/in/sooraj" },
      { platform: "GitHub", url: "https://github.com/sooraj" },
      { platform: "Twitter", url: "https://twitter.com/sooraj" },
    ],
    workExperience: [
      {
        company: "Philonet",
        position: "Remote Internship",
        startDate: "Jan 2025",
        endDate: "May 2025",
        description:
          'Built responsive UI components in Next JS framework for real-time discussion features like "Hot Rooms" and "Spark Thoughts.". Developed interactive tools for highlighting and sharing content from web pages, PDFs, and videos. Collaborated with backend and design teams to integrate AI-driven features and improve user experience.',
      },
      {
        company: "Freelance Project",
        position: "Web Developer",
        startDate: "Mar 2025",
        endDate: "Present",
        description:
          "Built and deployed a fully responsive event website within 24 hours for a college IT fest. Drove 2K+ visits in the first week and 4K+ total views by event end, maintaining a low 20% bounce rate. Delivered features like event schedules, registration, and live updates to enhance user engagement.",
      },
    ],
    skills: [
      "HTML",
      "CSS",
      "JavaScript",
      "TypeScript",
      "Python",
      "ReactJS",
      "NodeJS",
      "ExpressJS",
      "NextJS",
      "Tailwind CSS",
      "Socket.io",
      "Zustand",
      "Firebase",
      "MongoDB",
      "Redis",
      "Mongoose",
      "Prisma",
      "PostgreSQL",
      "Git",
      "Postman",
      "Docker",
      "AWS",
      "GitHub Actions",
    ],
    education: [
      {
        institution: "Sacred Heart College, Madanthyar, Karnataka, India",
        degree: "Bachelors in Computer Application (BCA)",
        field: "",
        startDate: "2020",
        endDate: "2023",
      },
      {
        institution:
          "Srinivas Institute of Technology, Mangalore, Karnataka, India",
        degree: "Masters in Computer Application (MCA)",
        field: "",
        startDate: "2023",
        endDate: "2025",
      },
    ],
    certifications: [],
  };

  useEffect(() => {
    if (data) {
      setPortfolioData(data);
    } else {
      // Try to get from localStorage, fallback to demo data
      try {
        const stored = localStorage.getItem("portfolioFormData");
        if (stored) {
          setPortfolioData(JSON.parse(stored));
        } else {
          setPortfolioData(demoData);
        }
      } catch {
        setPortfolioData(demoData);
      }
    }
  }, [data]);

  if (!portfolioData) return <div>Loading...</div>;

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "linkedin":
        return <Linkedin className="w-5 h-5" />;
      case "github":
        return <Github className="w-5 h-5" />;
      case "twitter":
        return <Twitter className="w-5 h-5" />;
      default:
        return <ExternalLink className="w-5 h-5" />;
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "about":
        return (
          <div className="space-y-8">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">About Me</h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg">
                {portfolioData.personalInfo.bio ||
                  "Passionate developer focused on creating innovative solutions and exceptional user experiences."}
              </p>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <Briefcase className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Work Experience
                </h2>
              </div>
              <div className="space-y-6">
                {portfolioData.workExperience.map((exp, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-600">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {exp.position}
                          </h3>
                          <p className="text-blue-600 font-medium">
                            {exp.company}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 mt-2 md:mt-0">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {exp.startDate} - {exp.endDate || "Present"}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">
                        {exp.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">Education</h2>
              </div>
              <div className="space-y-4">
                {portfolioData.education.map((edu, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {edu.degree}
                          </h3>
                          <p className="text-blue-600 font-medium">
                            {edu.institution}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 mt-2 md:mt-0">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {edu.startDate} - {edu.endDate}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </div>
        );

      case "skills":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <Code className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Skills & Technologies
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {portfolioData.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="p-3 text-center justify-center"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        );

      case "certifications":
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
              <Award className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Certifications
              </h2>
            </div>
            {portfolioData.certifications.length > 0 ? (
              <div className="space-y-4">
                {portfolioData.certifications.map((cert, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {cert.name}
                      </h3>
                      <p className="text-blue-600 font-medium">{cert.issuer}</p>
                      <p className="text-gray-500">{cert.date}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No certifications added yet.
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {portfolioData.personalInfo.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {portfolioData.personalInfo.name}
                </h1>
                <p className="text-xl text-blue-600">
                  {portfolioData.personalInfo.title}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{portfolioData.personalInfo.email}</span>
              </div>
              {portfolioData.personalInfo.phone && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{portfolioData.personalInfo.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{portfolioData.personalInfo.location}</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-4 mt-6">
            {portfolioData.socialLinks.map((link, index) => (
              <Button key={index} variant="outline" size="sm" className="gap-2">
                {getSocialIcon(link.platform)}
                {link.platform}
              </Button>
            ))}
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-8">
            {[
              { id: "about", label: "About", icon: User },
              { id: "skills", label: "Skills", icon: Code },
              { id: "certifications", label: "Certifications", icon: Award },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                  activeSection === id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">{renderContent()}</main>
    </div>
  );
}
