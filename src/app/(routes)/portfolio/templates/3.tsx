"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  User,
  Briefcase,
  Code,
  Menu,
  X,
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

interface PortfolioTemplate3Props {
  data?: PortfolioData;
}

export default function PortfolioTemplate3({ data }: PortfolioTemplate3Props) {
  const [activeSection, setActiveSection] = useState("profile");
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(
    null
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  const sections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Code },
    { id: "education", label: "Education", icon: GraduationCap },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return (
          <div className="grid lg:grid-cols-2 gap-8">
            <Card className="h-fit">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {portfolioData.personalInfo.name.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {portfolioData.personalInfo.name}
                    </h2>
                    <p className="text-orange-600 font-semibold">
                      {portfolioData.personalInfo.title}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  {portfolioData.personalInfo.bio}
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{portfolioData.personalInfo.email}</span>
                  </div>
                  {portfolioData.personalInfo.phone && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{portfolioData.personalInfo.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{portfolioData.personalInfo.location}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  {portfolioData.socialLinks.map((link, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      {getSocialIcon(link.platform)}
                      {link.platform}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <h3 className="text-xl font-bold">Quick Stats</h3>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {portfolioData.workExperience.length}
                      </div>
                      <div className="text-sm text-gray-600">
                        Work Experience
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {portfolioData.skills.length}
                      </div>
                      <div className="text-sm text-gray-600">Skills</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {portfolioData.education.length}
                      </div>
                      <div className="text-sm text-gray-600">Education</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {portfolioData.certifications.length}
                      </div>
                      <div className="text-sm text-gray-600">
                        Certifications
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case "experience":
        return (
          <div className="space-y-6">
            {portfolioData.workExperience.map((exp, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                        {exp.company.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{exp.position}</h3>
                        <p className="text-orange-600 font-semibold">
                          {exp.company}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <Calendar className="w-3 h-3" />
                      {exp.startDate} - {exp.endDate || "Present"}
                    </Badge>
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {exp.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case "skills":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {portfolioData.skills.map((skill, index) => (
                <Card
                  key={index}
                  className="hover:shadow-md transition-shadow cursor-pointer hover:scale-105 transform transition-transform"
                >
                  <CardContent className="p-4 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold mx-auto mb-3">
                      <Code className="w-6 h-6" />
                    </div>
                    <p className="font-semibold">{skill}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case "education":
        return (
          <div className="space-y-6">
            {portfolioData.education.map((edu, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{edu.degree}</h3>
                        <p className="text-blue-600 font-semibold">
                          {edu.institution}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary" className="gap-1">
                      <Calendar className="w-3 h-3" />
                      {edu.startDate} - {edu.endDate}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-white shadow-lg"
        >
          {isMobileMenuOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <Menu className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-80 bg-white shadow-xl transform transition-transform lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {portfolioData.personalInfo.name.charAt(0)}
            </div>
            <div>
              <h1 className="text-xl font-bold">
                {portfolioData.personalInfo.name}
              </h1>
              <p className="text-orange-600">
                {portfolioData.personalInfo.title}
              </p>
            </div>
          </div>
        </div>

        <nav className="p-6">
          <div className="space-y-2">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveSection(id);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeSection === id
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-5 h-5" />
                {label}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="lg:ml-80 p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {sections.find((s) => s.id === activeSection)?.label}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"></div>
          </div>

          {renderContent()}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
