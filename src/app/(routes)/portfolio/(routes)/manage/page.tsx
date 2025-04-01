"use client";

import { CardFooter } from "@/components/ui/card";

import { useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Award,
  BookOpen,
  Briefcase,
  Edit,
  Eye,
  FileText,
  Globe,
  Laptop,
  Plus,
  Save,
  Trash2,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock data for the portfolio sections
const mockPortfolioData = {
  personalInfo: {
    name: "John Doe",
    title: "Full Stack Developer",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    bio: "Full Stack Developer with 5 years of experience building web applications with React, Node.js, and TypeScript.",
  },
  socialLinks: [
    { platform: "LinkedIn", url: "https://linkedin.com/in/johndoe" },
    { platform: "GitHub", url: "https://github.com/johndoe" },
    { platform: "Twitter", url: "https://twitter.com/johndoe" },
  ],
  workExperience: [
    {
      company: "Tech Solutions Inc.",
      position: "Senior Developer",
      startDate: "01/2020",
      endDate: "Present",
      description:
        "Led development of multiple web applications using React and Node.js.",
    },
    {
      company: "Web Innovations",
      position: "Frontend Developer",
      startDate: "03/2018",
      endDate: "12/2019",
      description:
        "Developed responsive user interfaces using React and TypeScript.",
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "GraphQL",
    "MongoDB",
  ],
  education: [
    {
      institution: "University of Technology",
      degree: "Bachelor's",
      field: "Computer Science",
      startDate: "09/2014",
      endDate: "06/2018",
    },
  ],
  certifications: [
    {
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "05/2021",
      url: "https://aws.amazon.com/certification/certified-developer-associate/",
    },
  ],
  projects: [
    {
      title: "E-commerce Platform",
      description:
        "A full-stack e-commerce platform built with React, Node.js, and MongoDB.",
      technologies: ["React", "Node.js", "MongoDB", "Express"],
      url: "https://github.com/johndoe/ecommerce",
      image: "/placeholder.svg?height=300&width=400",
    },
    {
      title: "Task Management App",
      description:
        "A task management application with drag-and-drop functionality.",
      technologies: ["React", "TypeScript", "Firebase"],
      url: "https://github.com/johndoe/taskmanager",
      image: "/placeholder.svg?height=300&width=400",
    },
  ],
};

export default function ManagePage() {
  const [portfolioData, setPortfolioData] = useState(mockPortfolioData);
  const [activeSection, setActiveSection] = useState("personal");
  const [editMode, setEditMode] = useState(false);

  // Function to handle saving changes
  const handleSave = () => {
    // In a real app, you would save the data to a database here
    console.log("Saving portfolio data:", portfolioData);
    setEditMode(false);
  };

  // Function to move a section up
  const moveUp = (section: string, index: number) => {
    if (index === 0) return;

    const newData = { ...portfolioData };
    const sectionData = [...newData[section]];
    const temp = sectionData[index];
    sectionData[index] = sectionData[index - 1];
    sectionData[index - 1] = temp;

    setPortfolioData({
      ...newData,
      [section]: sectionData,
    });
  };

  // Function to move a section down
  const moveDown = (section: string, index: number, length: number) => {
    if (index === length - 1) return;

    const newData = { ...portfolioData };
    const sectionData = [...newData[section]];
    const temp = sectionData[index];
    sectionData[index] = sectionData[index + 1];
    sectionData[index + 1] = temp;

    setPortfolioData({
      ...newData,
      [section]: sectionData,
    });
  };

  // Function to add a new item to a section
  const addItem = (
    section: string,
    item: {
      platform?: string;
      url?: string;
      company?: "";
      position?: string;
      startDate?: string;
      endDate?: string;
      description?: string;
    }
  ) => {
    const newData = { ...portfolioData };
    const sectionData = [...newData[section], item];

    setPortfolioData({
      ...newData,
      [section]: sectionData,
    });
  };

  // Function to remove an item from a section
  const removeItem = (section: string, index: number) => {
    const newData = { ...portfolioData };
    const sectionData = [...newData[section]];
    sectionData.splice(index, 1);

    setPortfolioData({
      ...newData,
      [section]: sectionData,
    });
  };

  // Function to update an item in a section
  const updateItem = (
    section: string,
    index: number,
    field: string,
    value: string
  ) => {
    const newData = { ...portfolioData };
    const sectionData = [...newData[section]];
    sectionData[index] = { ...sectionData[index], [field]: value };

    setPortfolioData({
      ...newData,
      [section]: sectionData,
    });
  };

  // Function to update personal info
  const updatePersonalInfo = (field: string, value: string) => {
    setPortfolioData({
      ...portfolioData,
      personalInfo: {
        ...portfolioData.personalInfo,
        [field]: value,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Manage Portfolio</h1>
          <p className="text-muted-foreground">
            Edit and organize your portfolio content
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={editMode ? "default" : "outline"}
            onClick={() => setEditMode(!editMode)}
          >
            <Edit className="mr-2 h-4 w-4" />
            {editMode ? "Editing Mode" : "Edit Portfolio"}
          </Button>
          <Button asChild variant="outline">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Eye className="mr-2 h-4 w-4" />
              Preview
            </a>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Sections</CardTitle>
            <CardDescription>Manage your portfolio sections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <Button
                variant={activeSection === "personal" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection("personal")}
              >
                <User className="mr-2 h-4 w-4" />
                Personal Information
              </Button>
              <Button
                variant={activeSection === "social" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection("social")}
              >
                <Globe className="mr-2 h-4 w-4" />
                Social Links
              </Button>
              <Button
                variant={activeSection === "work" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection("work")}
              >
                <Briefcase className="mr-2 h-4 w-4" />
                Work Experience
              </Button>
              <Button
                variant={activeSection === "skills" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection("skills")}
              >
                <Laptop className="mr-2 h-4 w-4" />
                Skills
              </Button>
              <Button
                variant={activeSection === "education" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection("education")}
              >
                <BookOpen className="mr-2 h-4 w-4" />
                Education
              </Button>
              <Button
                variant={
                  activeSection === "certifications" ? "default" : "ghost"
                }
                className="w-full justify-start"
                onClick={() => setActiveSection("certifications")}
              >
                <Award className="mr-2 h-4 w-4" />
                Certifications
              </Button>
              <Button
                variant={activeSection === "projects" ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveSection("projects")}
              >
                <FileText className="mr-2 h-4 w-4" />
                Projects
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            {editMode && (
              <Button className="w-full" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            )}
          </CardFooter>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>
              {activeSection === "personal" && "Personal Information"}
              {activeSection === "social" && "Social Links"}
              {activeSection === "work" && "Work Experience"}
              {activeSection === "skills" && "Skills"}
              {activeSection === "education" && "Education"}
              {activeSection === "certifications" && "Certifications"}
              {activeSection === "projects" && "Projects"}
            </CardTitle>
            <CardDescription>
              {activeSection === "personal" && "Edit your personal information"}
              {activeSection === "social" && "Manage your social media links"}
              {activeSection === "work" && "Add and edit your work experience"}
              {activeSection === "skills" && "Showcase your skills"}
              {activeSection === "education" &&
                "Add your educational background"}
              {activeSection === "certifications" && "Add your certifications"}
              {activeSection === "projects" && "Showcase your projects"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Personal Information Section */}
            {activeSection === "personal" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={portfolioData.personalInfo.name}
                      onChange={(e) =>
                        updatePersonalInfo("name", e.target.value)
                      }
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      value={portfolioData.personalInfo.title}
                      onChange={(e) =>
                        updatePersonalInfo("title", e.target.value)
                      }
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={portfolioData.personalInfo.email}
                      onChange={(e) =>
                        updatePersonalInfo("email", e.target.value)
                      }
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={portfolioData.personalInfo.phone}
                      onChange={(e) =>
                        updatePersonalInfo("phone", e.target.value)
                      }
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={portfolioData.personalInfo.location}
                      onChange={(e) =>
                        updatePersonalInfo("location", e.target.value)
                      }
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      className="min-h-[120px]"
                      value={portfolioData.personalInfo.bio}
                      onChange={(e) =>
                        updatePersonalInfo("bio", e.target.value)
                      }
                      disabled={!editMode}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Social Links Section */}
            {activeSection === "social" && (
              <div className="space-y-4">
                {portfolioData.socialLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`platform-${index}`}>Platform</Label>
                        <Input
                          id={`platform-${index}`}
                          value={link.platform}
                          onChange={(e) =>
                            updateItem(
                              "socialLinks",
                              index,
                              "platform",
                              e.target.value
                            )
                          }
                          disabled={!editMode}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`url-${index}`}>URL</Label>
                        <Input
                          id={`url-${index}`}
                          value={link.url}
                          onChange={(e) =>
                            updateItem(
                              "socialLinks",
                              index,
                              "url",
                              e.target.value
                            )
                          }
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                    {editMode && (
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => moveUp("socialLinks", index)}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            moveDown(
                              "socialLinks",
                              index,
                              portfolioData.socialLinks.length
                            )
                          }
                          disabled={
                            index === portfolioData.socialLinks.length - 1
                          }
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem("socialLinks", index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                {editMode && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      addItem("socialLinks", { platform: "", url: "" })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Social Link
                  </Button>
                )}
              </div>
            )}

            {/* Work Experience Section */}
            {activeSection === "work" && (
              <div className="space-y-4">
                {portfolioData.workExperience.map((exp, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-medium">Experience {index + 1}</h3>
                      {editMode && (
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => moveUp("workExperience", index)}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              moveDown(
                                "workExperience",
                                index,
                                portfolioData.workExperience.length
                              )
                            }
                            disabled={
                              index === portfolioData.workExperience.length - 1
                            }
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem("workExperience", index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`company-${index}`}>Company</Label>
                        <Input
                          id={`company-${index}`}
                          value={exp.company}
                          onChange={(e) =>
                            updateItem(
                              "workExperience",
                              index,
                              "company",
                              e.target.value
                            )
                          }
                          disabled={!editMode}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`position-${index}`}>Position</Label>
                        <Input
                          id={`position-${index}`}
                          value={exp.position}
                          onChange={(e) =>
                            updateItem(
                              "workExperience",
                              index,
                              "position",
                              e.target.value
                            )
                          }
                          disabled={!editMode}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`startDate-${index}`}>Start Date</Label>
                        <Input
                          id={`startDate-${index}`}
                          value={exp.startDate}
                          onChange={(e) =>
                            updateItem(
                              "workExperience",
                              index,
                              "startDate",
                              e.target.value
                            )
                          }
                          disabled={!editMode}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`endDate-${index}`}>End Date</Label>
                        <Input
                          id={`endDate-${index}`}
                          value={exp.endDate}
                          onChange={(e) =>
                            updateItem(
                              "workExperience",
                              index,
                              "endDate",
                              e.target.value
                            )
                          }
                          disabled={!editMode}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`description-${index}`}>
                          Description
                        </Label>
                        <Textarea
                          id={`description-${index}`}
                          className="min-h-[100px]"
                          value={exp.description}
                          onChange={(e) =>
                            updateItem(
                              "workExperience",
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          disabled={!editMode}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {editMode && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      addItem("workExperience", {
                        company: "",
                        position: "",
                        startDate: "",
                        endDate: "",
                        description: "",
                      })
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Work Experience
                  </Button>
                )}
              </div>
            )}

            {/* Skills Section */}
            {activeSection === "skills" && <div>{/* rest of code here */}</div>}

            {/* Education Section */}
            {activeSection === "education" && (
              <div>{/* rest of code here */}</div>
            )}

            {/* Certifications Section */}
            {activeSection === "certifications" && (
              <div>{/* rest of code here */}</div>
            )}

            {/* Projects Section */}
            {activeSection === "projects" && (
              <div>{/* rest of code here */}</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
