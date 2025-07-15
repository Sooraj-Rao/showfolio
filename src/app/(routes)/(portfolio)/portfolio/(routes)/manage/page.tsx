/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CardFooter } from "@/components/ui/card";
import { useState, useEffect } from "react";
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
  Trophy,
  Loader2,
  Code,
  Database,
  Smartphone,
  Wrench,
  Palette,
  Info,
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
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import useGetUserData from "@/app/hooks/use-getUserData";

type PersonalInfo = {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  resumeUrl?: string;
};

type SocialLink = {
  platform: string;
  url: string;
};

type WorkExperience = {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
};

type Project = {
  name: string;
  description: string;
  technology: string;
  link: string;
  imageUrl: string;
};

type Achievement = {
  description: string;
  link: string;
};

type Education = {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
};

type Certification = {
  name: string;
  issuer: string;
  date: string;
  url: string;
};

type Blog = {
  title: string;
  date: string;
  description: string;
};

type PortfolioData = {
  personalInfo: PersonalInfo;
  socialLinks: SocialLink[];
  workExperience: WorkExperience[];
  skills: Record<string, string[]>;
  projects: Project[];
  achievements: Achievement[];
  education: Education[];
  certifications: Certification[];
  blogs: Blog[];
};

const defaultPortfolioData: PortfolioData = {
  personalInfo: {
    name: "",
    title: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
  },
  socialLinks: [{ platform: "", url: "" }],
  workExperience: [
    {
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    },
  ],
  skills: {
    Frontend: [""],
    Backend: [""],
    Tools: [""],
  },
  projects: [
    {
      name: "",
      description: "",
      technology: "",
      link: "",
      imageUrl: "",
    },
  ],
  achievements: [
    {
      description: "",
      link: "",
    },
  ],
  education: [
    {
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
    },
  ],
  certifications: [
    {
      name: "",
      issuer: "",
      date: "",
      url: "",
    },
  ],
  blogs: [
    {
      title: "",
      date: "",
      description: "",
    },
  ],
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

export default function ManagePortfolio() {
  const { toast } = useToast();
  const { userData } = useGetUserData();
  const [portfolioData, setPortfolioData] =
    useState<PortfolioData>(defaultPortfolioData);
  const [activeSection, setActiveSection] = useState("personal");
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [imageUrl, setimageUrl] = useState(userData?.imageUrl || "");

  useEffect(() => {
    const savedData = localStorage.getItem("portfolioData");
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (Array.isArray(parsedData.skills)) {
          parsedData.skills = {
            General: parsedData.skills,
          };
        }
        setPortfolioData(parsedData);
      } catch (error) {
        console.error("Error parsing portfolio data:", error);
        toast({
          title: "Error loading data",
          description: "There was an error loading your portfolio data.",
          variant: "destructive",
        });
      }
    } else {
      fetchPortfolioData();
    }
    if (userData?.imageUrl) {
      setimageUrl(userData?.imageUrl);
    }
  }, [userData]);

  const fetchPortfolioData = async () => {
    try {
      const response = await fetch(`/api/portfolio/portfolio-data`);
      if (!response.ok) {
        throw new Error("Failed to fetch portfolio data");
      }
      const data = await response.json();
      if (data?.portfolio) {
        if (Array.isArray(data.portfolio.skills)) {
          data.portfolio.skills = {
            General: data.portfolio.skills,
          };
        }
        setPortfolioData(data?.portfolio);
        localStorage.setItem("portfolioData", JSON.stringify(data.portfolio));
      } else
        toast({
          title: "Error",
          description: data?.error?.message || "Failed to load portfolio data",
          variant: "destructive",
        });
    } catch {
      toast({
        title: "Error loading data",
        description: "There was an error loading your portfolio data.",
        variant: "destructive",
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await axios.post("/api/portfolio/portfolio-data", {
        portfolioData,
        imageUrl,
      });

      if (res.status === 200) {
        toast({
          title: "Portfolio saved successfully",
          description: "Your portfolio has been updated.",
        });
        setEditMode(false);
        localStorage.setItem("portfolioData", JSON.stringify(portfolioData));
      } else {
        throw new Error("Failed to save portfolio");
      }
    } catch (error) {
      console.error("Error saving portfolio:", error);
      toast({
        title: "Error saving portfolio",
        description:
          "There was an error saving your portfolio. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    setPortfolioData({
      ...portfolioData,
      personalInfo: {
        ...portfolioData.personalInfo,
        [field]: value,
      },
    });
  };

  const addSkillCategory = () => {
    const categoryName = prompt(
      "Enter category name (e.g., Frontend, Backend, Tools):"
    );
    if (!categoryName) return;

    setPortfolioData({
      ...portfolioData,
      skills: {
        ...portfolioData.skills,
        [categoryName]: [""],
      },
    });
  };

  const removeSkillCategory = (categoryName: string) => {
    const newSkills = { ...portfolioData.skills };
    delete newSkills[categoryName];
    setPortfolioData({
      ...portfolioData,
      skills: newSkills,
    });
  };

  const updateSkillCategoryName = (oldName: string, newName: string) => {
    if (oldName === newName) return;

    const newSkills = { ...portfolioData.skills };
    newSkills[newName] = newSkills[oldName];
    delete newSkills[oldName];

    setPortfolioData({
      ...portfolioData,
      skills: newSkills,
    });
  };

  const addSkillToCategory = (categoryName: string) => {
    setPortfolioData({
      ...portfolioData,
      skills: {
        ...portfolioData.skills,
        [categoryName]: [...portfolioData.skills[categoryName], ""],
      },
    });
  };

  const updateSkillInCategory = (
    categoryName: string,
    skillIndex: number,
    value: string
  ) => {
    const newSkills = [...portfolioData.skills[categoryName]];
    newSkills[skillIndex] = value;

    setPortfolioData({
      ...portfolioData,
      skills: {
        ...portfolioData.skills,
        [categoryName]: newSkills,
      },
    });
  };

  const removeSkillFromCategory = (
    categoryName: string,
    skillIndex: number
  ) => {
    const newSkills = [...portfolioData.skills[categoryName]];
    newSkills.splice(skillIndex, 1);

    setPortfolioData({
      ...portfolioData,
      skills: {
        ...portfolioData.skills,
        [categoryName]: newSkills,
      },
    });
  };

  const moveUp = (section: keyof PortfolioData, index: number) => {
    if (index === 0) return;

    const newData = { ...portfolioData };
    const sectionData = [...(newData[section] as any[])];
    const temp = sectionData[index];
    sectionData[index] = sectionData[index - 1];
    sectionData[index - 1] = temp;

    setPortfolioData({
      ...newData,
      [section]: sectionData,
    });
  };

  const moveDown = (
    section: keyof PortfolioData,
    index: number,
    length: number
  ) => {
    if (index === length - 1) return;

    const newData = { ...portfolioData };
    const sectionData = [...(newData[section] as any[])];
    const temp = sectionData[index];
    sectionData[index] = sectionData[index + 1];
    sectionData[index + 1] = temp;

    setPortfolioData({
      ...newData,
      [section]: sectionData,
    });
  };

  const addItem = (section: keyof PortfolioData, item: any) => {
    let sectionData;
    const newData = { ...portfolioData };
    if (section == "blogs" && !portfolioData?.blogs) {
      portfolioData.blogs = item;
      sectionData = [item];
    } else {
      sectionData = [...(newData[section] as any[]), item];
    }

    setPortfolioData({
      ...newData,
      [section]: sectionData,
    });
  };

  const removeItem = (section: keyof PortfolioData, index: number) => {
    const newData = { ...portfolioData };
    const sectionData = [...(newData[section] as any[])];
    sectionData.splice(index, 1);

    setPortfolioData({
      ...newData,
      [section]: sectionData,
    });
  };

  const updateItem = (
    section: keyof PortfolioData,
    index: number,
    field: string,
    value: string
  ) => {
    const newData = { ...portfolioData };
    const sectionData = [...(newData[section] as any[])];
    sectionData[index] = { ...sectionData[index], [field]: value };

    setPortfolioData({
      ...newData,
      [section]: sectionData,
    });
  };

  const insertLink = (
    textareaId: string,
    linkText: string,
    linkUrl: string
  ) => {
    const textarea = document.getElementById(textareaId) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end, text.length);
    const linkMarkdown = `[${linkText}](${linkUrl})`;

    const newText = before + linkMarkdown + after;
    textarea.value = newText;

    const event = new Event("input", { bubbles: true });
    textarea.dispatchEvent(event);

    const newCursorPos = start + linkMarkdown.length;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    textarea.focus();
  };

  const handleInsertLink = (textareaId: string) => {
    const linkText = prompt("Enter link text:");
    if (!linkText) return;

    const linkUrl = prompt("Enter link URL:");
    if (!linkUrl) return;

    insertLink(textareaId, linkText, linkUrl);
  };

  return (
    <div className="min-h-screen bg-background ">
      <div className="mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Manage Portfolio
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant={editMode ? "default" : "outline"}
              onClick={() => setEditMode(!editMode)}
              className="w-full sm:w-auto"
            >
              <Edit className="mr-2 h-4 w-4" />
              {editMode ? "Editing Mode" : "Edit Portfolio"}
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <a
                href={`/p/preview?username=${
                  userData?.portfolio || userData?.name
                }&ref=demo`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </a>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Sections</CardTitle>
              <CardDescription>Manage your portfolio sections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <Button
                  variant={activeSection === "personal" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("personal")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Personal Info
                </Button>
                <Button
                  variant={activeSection === "social" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("social")}
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Social Links
                </Button>
                <Button
                  variant={activeSection === "work" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("work")}
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Work Experience
                </Button>
                <Button
                  variant={activeSection === "skills" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("skills")}
                >
                  <Laptop className="mr-2 h-4 w-4" />
                  Skills
                </Button>
                <Button
                  variant={activeSection === "projects" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("projects")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Projects
                </Button>
                <Button
                  variant={
                    activeSection === "achievements" ? "secondary" : "ghost"
                  }
                  className="w-full justify-start"
                  onClick={() => setActiveSection("achievements")}
                >
                  <Trophy className="mr-2 h-4 w-4" />
                  Achievements
                </Button>
                <Button
                  variant={
                    activeSection === "education" ? "secondary" : "ghost"
                  }
                  className="w-full justify-start"
                  onClick={() => setActiveSection("education")}
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Education
                </Button>
                <Button
                  variant={
                    activeSection === "certifications" ? "secondary" : "ghost"
                  }
                  className="w-full justify-start"
                  onClick={() => setActiveSection("certifications")}
                >
                  <Award className="mr-2 h-4 w-4" />
                  Certifications
                </Button>
                <Button
                  variant={activeSection === "blogs" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("blogs")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Blogs
                </Button>
                <Button
                  variant={
                    activeSection === "resumeOrImage" ? "secondary" : "ghost"
                  }
                  className="w-full justify-start"
                  onClick={() => setActiveSection("resumeOrImage")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Image/Resume
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              {editMode && (
                <Button
                  className="w-full"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              )}
            </CardFooter>
          </Card>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>
                {activeSection === "personal" && "Personal Information"}
                {activeSection === "social" && "Social Links"}
                {activeSection === "work" && "Work Experience"}
                {activeSection === "skills" && "Skills"}
                {activeSection === "projects" && "Projects"}
                {activeSection === "achievements" && "Achievements"}
                {activeSection === "education" && "Education"}
                {activeSection === "certifications" && "Certifications"}
                {activeSection === "blogs" && "Blogs"}
                {activeSection === "resumeOrImage" && "Image and Resume "}
              </CardTitle>
              <CardDescription>
                {activeSection === "personal" &&
                  "Edit your personal information"}
                {activeSection === "social" && "Manage your social media links"}
                {activeSection === "work" &&
                  "Add and edit your work experience"}
                {activeSection === "skills" &&
                  "Organize your skills by category"}
                {activeSection === "projects" && "Showcase your projects"}
                {activeSection === "achievements" &&
                  "Add your achievements and awards"}
                {activeSection === "education" &&
                  "Add your educational background"}
                {activeSection === "certifications" &&
                  "Add your certifications"}
                {activeSection === "blogs" &&
                  "Write and manage your blog posts"}
                {activeSection === "resumeOrImage" &&
                  "Manage your resume and image URL"}
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[70vh] overflow-y-auto">
              {activeSection === "personal" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={portfolioData?.personalInfo?.name}
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
                        value={portfolioData?.personalInfo?.title}
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
                        value={portfolioData?.personalInfo?.email}
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
                        value={portfolioData?.personalInfo?.phone}
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
                        value={portfolioData?.personalInfo?.location}
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
                        value={portfolioData?.personalInfo?.bio}
                        onChange={(e) =>
                          updatePersonalInfo("bio", e.target.value)
                        }
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "social" && (
                <div className="space-y-4">
                  {portfolioData?.socialLinks?.map((link, index) => (
                    <div
                      key={index}
                      className="flex flex-col md:flex-row items-start gap-4 p-4 border rounded-lg"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
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
                            placeholder="LinkedIn, GitHub, Twitter, etc."
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
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                      {editMode && (
                        <div className="flex md:flex-col gap-2">
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
                            disabled={portfolioData.socialLinks.length === 1}
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

              {activeSection === "work" && (
                <div className="space-y-4">
                  {portfolioData.workExperience.map((exp, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
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
                                index ===
                                portfolioData.workExperience.length - 1
                              }
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                removeItem("workExperience", index)
                              }
                              disabled={
                                portfolioData.workExperience.length === 1
                              }
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
                            placeholder="Company name"
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
                            placeholder="Job title"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`startDate-${index}`}>
                            Start Date
                          </Label>
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
                            placeholder="MM/YYYY"
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
                            placeholder="MM/YYYY or Present"
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
                            placeholder="Describe your responsibilities and achievements..."
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

              {activeSection === "skills" && (
                <div className="space-y-6">
                  {Object.entries(portfolioData.skills).map(
                    ([categoryName, skills]) => {
                      const IconComponent =
                        skillCategoryIcons[categoryName.toLowerCase()] || Code;
                      return (
                        <div
                          key={categoryName}
                          className="p-4 border rounded-lg space-y-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-5 h-5 text-muted-foreground" />
                              {editMode ? (
                                <Input
                                  autoFocus
                                  value={categoryName}
                                  onChange={(e) =>
                                    updateSkillCategoryName(
                                      categoryName,
                                      e.target.value
                                    )
                                  }
                                  className="font-medium text-lg w-auto min-w-[150px]"
                                  placeholder="Category name"
                                />
                              ) : (
                                <h3 className="font-medium text-lg capitalize">
                                  {categoryName}
                                </h3>
                              )}
                            </div>
                            {editMode && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                  removeSkillCategory(categoryName)
                                }
                                disabled={
                                  Object.keys(portfolioData.skills).length === 1
                                }
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {skills.map((skill, skillIndex) => (
                              <div
                                key={skillIndex}
                                className="flex items-center gap-2"
                              >
                                <Input
                                  value={skill}
                                  onChange={(e) =>
                                    updateSkillInCategory(
                                      categoryName,
                                      skillIndex,
                                      e.target.value
                                    )
                                  }
                                  disabled={!editMode}
                                  placeholder="Skill name"
                                  className="flex-1"
                                />
                                {editMode && (
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                      removeSkillFromCategory(
                                        categoryName,
                                        skillIndex
                                      )
                                    }
                                    disabled={skills.length === 1}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            ))}
                          </div>

                          {editMode && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => addSkillToCategory(categoryName)}
                            >
                              <Plus className="mr-2 h-3 w-3" />
                              Add Skill to {categoryName}
                            </Button>
                          )}
                        </div>
                      );
                    }
                  )}

                  {editMode && (
                    <Button variant="outline" onClick={addSkillCategory}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Skill Category
                    </Button>
                  )}
                </div>
              )}

              {activeSection === "projects" && (
                <div className="space-y-4">
                  {portfolioData.projects.map((project, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                        <h3 className="font-medium">Project {index + 1}</h3>
                        {editMode && (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveUp("projects", index)}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                moveDown(
                                  "projects",
                                  index,
                                  portfolioData.projects.length
                                )
                              }
                              disabled={
                                index === portfolioData.projects.length - 1
                              }
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem("projects", index)}
                              disabled={portfolioData.projects.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`projectName-${index}`}>
                            Project Name
                          </Label>
                          <Input
                            id={`projectName-${index}`}
                            value={project.name}
                            onChange={(e) =>
                              updateItem(
                                "projects",
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            disabled={!editMode}
                            placeholder="My Awesome Project"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`projectLink-${index}`}>
                            Project Link
                          </Label>
                          <Input
                            id={`projectLink-${index}`}
                            value={project.link}
                            onChange={(e) =>
                              updateItem(
                                "projects",
                                index,
                                "link",
                                e.target.value
                              )
                            }
                            disabled={!editMode}
                            placeholder="https://github.com/username/project"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`projectTechnology-${index}`}>
                            Technologies Used
                          </Label>
                          <Input
                            id={`projectTechnology-${index}`}
                            value={project.technology}
                            onChange={(e) =>
                              updateItem(
                                "projects",
                                index,
                                "technology",
                                e.target.value
                              )
                            }
                            disabled={!editMode}
                            placeholder="React, Node.js, MongoDB"
                          />
                          <p className="text-xs text-muted-foreground">
                            Separate technologies with commas
                          </p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`projectImage-${index}`}>
                            Image URL
                          </Label>
                          <Input
                            id={`projectImage-${index}`}
                            value={project.imageUrl}
                            onChange={(e) =>
                              updateItem(
                                "projects",
                                index,
                                "imageUrl",
                                e.target.value
                              )
                            }
                            disabled={!editMode}
                            placeholder="https://example.com/project-image.jpg"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <Label htmlFor={`projectDescription-${index}`}>
                            Description
                          </Label>
                          <Textarea
                            id={`projectDescription-${index}`}
                            className="min-h-[100px]"
                            value={project.description}
                            onChange={(e) =>
                              updateItem(
                                "projects",
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            disabled={!editMode}
                            placeholder="Describe your project, its features, and what you learned..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {editMode && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        addItem("projects", {
                          name: "",
                          description: "",
                          technology: "",
                          link: "",
                          imageUrl: "",
                        })
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Project
                    </Button>
                  )}
                </div>
              )}

              {activeSection === "achievements" && (
                <div className="space-y-4">
                  {portfolioData.achievements.map((achievement, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                        <h3 className="font-medium">Achievement {index + 1}</h3>
                        {editMode && (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveUp("achievements", index)}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                moveDown(
                                  "achievements",
                                  index,
                                  portfolioData.achievements.length
                                )
                              }
                              disabled={
                                index === portfolioData.achievements.length - 1
                              }
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem("achievements", index)}
                              disabled={portfolioData.achievements.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`achievementDescription-${index}`}>
                            Achievement Description
                          </Label>
                          <Textarea
                            id={`achievementDescription-${index}`}
                            className="min-h-[100px]"
                            value={achievement.description}
                            onChange={(e) =>
                              updateItem(
                                "achievements",
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            disabled={!editMode}
                            placeholder="Describe your achievement, award, or recognition..."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`achievementLink-${index}`}>
                            Link (Optional)
                          </Label>
                          <Input
                            id={`achievementLink-${index}`}
                            value={achievement.link}
                            onChange={(e) =>
                              updateItem(
                                "achievements",
                                index,
                                "link",
                                e.target.value
                              )
                            }
                            disabled={!editMode}
                            placeholder="https://example.com/certificate or news article"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {editMode && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        addItem("achievements", {
                          description: "",
                          link: "",
                        })
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Achievement
                    </Button>
                  )}
                </div>
              )}

              {activeSection === "education" && (
                <div className="space-y-4">
                  {portfolioData.education.map((edu, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                        <h3 className="font-medium">Education {index + 1}</h3>
                        {editMode && (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveUp("education", index)}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                moveDown(
                                  "education",
                                  index,
                                  portfolioData.education.length
                                )
                              }
                              disabled={
                                index === portfolioData.education.length - 1
                              }
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem("education", index)}
                              disabled={portfolioData.education.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`institution-${index}`}>
                            Institution
                          </Label>
                          <Input
                            id={`institution-${index}`}
                            value={edu.institution}
                            onChange={(e) =>
                              updateItem(
                                "education",
                                index,
                                "institution",
                                e.target.value
                              )
                            }
                            disabled={!editMode}
                            placeholder="University of Example"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`degree-${index}`}>Degree</Label>
                          <Input
                            id={`degree-${index}`}
                            value={edu.degree}
                            onChange={(e) =>
                              updateItem(
                                "education",
                                index,
                                "degree",
                                e.target.value
                              )
                            }
                            disabled={!editMode}
                            placeholder="Bachelor's, Master's, etc."
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`field-${index}`}>
                            Field of Study
                          </Label>
                          <Input
                            id={`field-${index}`}
                            value={edu.field}
                            onChange={(e) =>
                              updateItem(
                                "education",
                                index,
                                "field",
                                e.target.value
                              )
                            }
                            disabled={!editMode}
                            placeholder="Computer Science, Business, etc."
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`eduStartDate-${index}`}>
                              Start Date
                            </Label>
                            <Input
                              id={`eduStartDate-${index}`}
                              value={edu.startDate}
                              onChange={(e) =>
                                updateItem(
                                  "education",
                                  index,
                                  "startDate",
                                  e.target.value
                                )
                              }
                              disabled={!editMode}
                              placeholder="MM/YYYY"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`eduEndDate-${index}`}>
                              End Date
                            </Label>
                            <Input
                              id={`eduEndDate-${index}`}
                              value={edu.endDate}
                              onChange={(e) =>
                                updateItem(
                                  "education",
                                  index,
                                  "endDate",
                                  e.target.value
                                )
                              }
                              disabled={!editMode}
                              placeholder="MM/YYYY or Present"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {editMode && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        addItem("education", {
                          institution: "",
                          degree: "",
                          field: "",
                          startDate: "",
                          endDate: "",
                        })
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Education
                    </Button>
                  )}
                </div>
              )}

              {activeSection === "certifications" && (
                <div className="space-y-4">
                  {portfolioData.certifications.map((cert, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                        <h3 className="font-medium">
                          Certification {index + 1}
                        </h3>
                        {editMode && (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveUp("certifications", index)}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                moveDown(
                                  "certifications",
                                  index,
                                  portfolioData.certifications.length
                                )
                              }
                              disabled={
                                index ===
                                portfolioData.certifications.length - 1
                              }
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                removeItem("certifications", index)
                              }
                              disabled={
                                portfolioData.certifications.length === 1
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`certName-${index}`}>
                            Certification Name
                          </Label>
                          <Input
                            id={`certName-${index}`}
                            value={cert.name}
                            onChange={(e) =>
                              updateItem(
                                "certifications",
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            disabled={!editMode}
                            placeholder="AWS Certified Solutions Architect"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`issuer-${index}`}>
                            Issuing Organization
                          </Label>
                          <Input
                            id={`issuer-${index}`}
                            value={cert.issuer}
                            onChange={(e) =>
                              updateItem(
                                "certifications",
                                index,
                                "issuer",
                                e.target.value
                              )
                            }
                            disabled={!editMode}
                            placeholder="Amazon Web Services"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`certDate-${index}`}>
                            Date Issued
                          </Label>
                          <Input
                            id={`certDate-${index}`}
                            value={cert.date}
                            onChange={(e) =>
                              updateItem(
                                "certifications",
                                index,
                                "date",
                                e.target.value
                              )
                            }
                            disabled={!editMode}
                            placeholder="MM/YYYY"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`certUrl-${index}`}>
                            Credential URL
                          </Label>
                          <Input
                            id={`certUrl-${index}`}
                            value={cert.url}
                            onChange={(e) =>
                              updateItem(
                                "certifications",
                                index,
                                "url",
                                e.target.value
                              )
                            }
                            disabled={!editMode}
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  {editMode && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        addItem("certifications", {
                          name: "",
                          issuer: "",
                          date: "",
                          url: "",
                        })
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Certification
                    </Button>
                  )}
                </div>
              )}

              {activeSection === "blogs" && (
                <div className="space-y-4">
                  {portfolioData?.blogs?.map((blog, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                        <h3 className="font-medium">Blog Post {index + 1}</h3>
                        {editMode && (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => moveUp("blogs", index)}
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                moveDown(
                                  "blogs",
                                  index,
                                  portfolioData.blogs.length
                                )
                              }
                              disabled={
                                index === portfolioData.blogs.length - 1
                              }
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem("blogs", index)}
                              disabled={portfolioData.blogs.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`blogTitle-${index}`}>
                            Blog Title
                          </Label>
                          <Input
                            id={`blogTitle-${index}`}
                            value={blog.title}
                            onChange={(e) =>
                              updateItem(
                                "blogs",
                                index,
                                "title",
                                e.target.value
                              )
                            }
                            disabled={!editMode}
                            placeholder="My Amazing Blog Post"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`blogDate-${index}`}>Date</Label>
                          <Input
                            id={`blogDate-${index}`}
                            type="date"
                            value={blog.date}
                            onChange={(e) =>
                              updateItem("blogs", index, "date", e.target.value)
                            }
                            disabled={!editMode}
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`blogDescription-${index}`}>
                              Description
                            </Label>
                            {editMode && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  handleInsertLink(`blogDescription-${index}`)
                                }
                              >
                                <Plus className="mr-1 h-3 w-3" />
                                Add Link
                              </Button>
                            )}
                          </div>
                          <Textarea
                            id={`blogDescription-${index}`}
                            className="min-h-[150px]"
                            value={blog.description}
                            onChange={(e) =>
                              updateItem(
                                "blogs",
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            disabled={!editMode}
                            placeholder="Write your blog content here... You can add links using the 'Add Link' button or manually with [text](url) format."
                          />
                          <p className="text-xs text-muted-foreground">
                            Tip: Use [text](url) format for links, or click
                            {"Add Link"} button above
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {editMode && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        addItem("blogs", {
                          title: "",
                          date: new Date().toISOString().split("T")[0],
                          description: "",
                        })
                      }
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Blog Post
                    </Button>
                  )}
                </div>
              )}
              {activeSection === "resumeOrImage" && (
                <div className=" flex flex-col gap-y-4">
                  <Card className=" w-full      shadow-md rounded-lg">
                    <CardContent className=" p-3 w-full ">
                      <form className="flex items-center  w-full gap-3">
                        <label className="block text-sm font-medium ">
                          Your Resume for portfolio
                        </label>
                        <Input
                          disabled={!editMode}
                          type="url"
                          name="resumeUrl"
                          value={portfolioData?.personalInfo?.resumeUrl}
                          onChange={(e) =>
                            updatePersonalInfo("resumeUrl", e.target.value)
                          }
                          placeholder="Enter Resume URL"
                          className="w-3/5  p-2 border rounded-lg"
                        />
                      </form>
                    </CardContent>
                  </Card>
                  <Card className=" w-full      shadow-md rounded-lg">
                    <CardContent className=" p-3 w-full ">
                      <div className="flex items-center  w-full gap-3">
                        <label className="block text-sm font-medium ">
                          Your image for Portfolio
                        </label>
                        <Input
                          type="url"
                          disabled={!editMode}
                          value={imageUrl}
                          onChange={(e) => setimageUrl(e.target.value)}
                          placeholder="Enter image URL"
                          className="w-3/5  p-2 border rounded-lg"
                        />
                      </div>
                      <p className="flex items-center text-xs mt-3 gap-2 text-muted-foreground">
                        <Info size={16} />
                        <span>
                          <strong>Tip:</strong> You can use your GitHub profile
                          image by appending{" "}
                          <code className=" bg-muted rounded-md p-1">.png</code>{" "}
                          to your GitHub URL. For example:{" "}
                          <code className=" bg-muted rounded-md p-1">
                            https://github.com/username.png
                          </code>
                        </span>
                      </p>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
