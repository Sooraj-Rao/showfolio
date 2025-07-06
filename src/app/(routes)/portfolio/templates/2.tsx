"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
  ChevronRight,
  Download,
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

interface PortfolioTemplate2Props {
  data?: PortfolioData;
}

export default function PortfolioTemplate2({ data }: PortfolioTemplate2Props) {
  // const [activeSection, setActiveSection] = useState("hero");
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null
  );
  const [isVisible, setIsVisible] = useState(false);

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
    setIsVisible(true);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div
          className={`relative z-10 text-center px-4 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl animate-bounce">
            {portfolioData.personalInfo.name.charAt(0)}
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {portfolioData.personalInfo.name}
          </h1>

          <p className="text-2xl md:text-3xl text-gray-300 mb-8 animate-pulse">
            {portfolioData.personalInfo.title}
          </p>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            {portfolioData.personalInfo.bio}
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {portfolioData.socialLinks.map((link, index) => (
              <Button
                key={index}
                variant="outline"
                size="lg"
                className="gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
              >
                {getSocialIcon(link.platform)}
                {link.platform}
              </Button>
            ))}
          </div>

          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg transition-all duration-300 hover:scale-105 shadow-2xl"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Resume
          </Button>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronRight className="w-6 h-6 text-white rotate-90" />
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Experience
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </div>

          <div className="space-y-8">
            {portfolioData.workExperience.map((exp, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105 hover:shadow-2xl"
              >
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {exp.position}
                      </h3>
                      <p className="text-blue-400 text-xl font-semibold">
                        {exp.company}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 mt-4 lg:mt-0">
                      <Calendar className="w-5 h-5" />
                      <span className="text-lg">
                        {exp.startDate} - {exp.endDate || "Present"}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-lg">
                    {exp.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Skills
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {portfolioData.skills.map((skill, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-lg border border-white/20 rounded-lg p-4 text-center text-white font-semibold hover:scale-110 transition-all duration-300 hover:shadow-lg cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Education
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
          </div>

          <div className="space-y-8">
            {portfolioData.education.map((edu, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-lg border-white/20 hover:bg-white/20 transition-all duration-500 hover:scale-105"
              >
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {edu.degree}
                      </h3>
                      <p className="text-blue-400 text-xl">{edu.institution}</p>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 mt-4 lg:mt-0">
                      <Calendar className="w-5 h-5" />
                      <span className="text-lg">
                        {edu.startDate} - {edu.endDate}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mb-12"></div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="flex flex-col items-center">
              <Mail className="w-12 h-12 text-blue-400 mb-4" />
              <p className="text-white text-lg">
                {portfolioData.personalInfo.email}
              </p>
            </div>
            {portfolioData.personalInfo.phone && (
              <div className="flex flex-col items-center">
                <Phone className="w-12 h-12 text-purple-400 mb-4" />
                <p className="text-white text-lg">
                  {portfolioData.personalInfo.phone}
                </p>
              </div>
            )}
            <div className="flex flex-col items-center">
              <MapPin className="w-12 h-12 text-green-400 mb-4" />
              <p className="text-white text-lg">
                {portfolioData.personalInfo.location}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
