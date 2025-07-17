/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileUp,
  Upload,
  User,
  Loader2,
  Trash2,
  Sparkles,
  Settings,
  ExternalLink,
  Badge,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import useGetUserData from "@/app/hooks/use-getUserData";
import type { IResume } from "@/models/resume";
import Link from "next/link";
import useResumes from "@/app/hooks/get-resumes";

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

type FormData = {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
  };
  socialLinks: SocialLink[];
  workExperience: WorkExperience[];
  skills: string[];
  projects: Project[];
  achievements: Achievement[];
  education: Education[];
  certifications: Certification[];
};

const initialFormData: FormData = {
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
  skills: [""],
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
};

const steps = [
  "Personal Information",
  "Social Links",
  "Work Experience",
  "Skills",
  "Projects",
  "Achievements",
  "Education",
  "Certifications",
  "Review",
];

export default function CreatePortfolioPage() {
  const router = useRouter();
  const [loader, setLoader] = useState(false);
  const { toast } = useToast();
  const { userData, fetchUserData } = useGetUserData();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(() => {
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("portfolioFormData");
      return savedData ? JSON.parse(savedData) : initialFormData;
    }
    return initialFormData;
  });

  const [showDataSourceSelection, setShowDataSourceSelection] = useState(true);
  const [dataSource, setDataSource] = useState<"manual" | "ai">("manual");
  const [aiOption, setAiOption] = useState<"upload" | "existing">("upload");
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  const processResumeWithAI = async (resumeSource: string) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      if (aiOption === "upload" && file) {
        formData.append("pdf", file);
      } else if (aiOption === "existing" && resumeSource) {
        formData.append("firebaseUrl", resumeSource);
      } else {
        alert("Missing resume input");
        return;
      }

      const response = await fetch("/api/portfolio/ai-parse", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to process resume");
      }

      const { result: data } = await response.json();
      if (!response.ok) {
        throw new Error("Failed to process resume");
      }
      if (!data) {
        throw new Error("No data returned from AI processing");
      }
      const newFormData = { ...initialFormData };

      newFormData.personalInfo.name = data.name || "";
      newFormData.personalInfo.email = data.email || "";
      newFormData.personalInfo.phone = data.phone || "";
      newFormData.personalInfo.location = data.location || "";

      if (data.socialLinks && data.socialLinks.length > 0) {
        newFormData.socialLinks = data.socialLinks.map((link) => {
          let platform = "Website";
          if (link.includes("linkedin")) platform = "LinkedIn";
          else if (link.includes("github")) platform = "GitHub";
          else if (link.includes("twitter")) platform = "Twitter";

          return {
            platform,
            url: link.startsWith("http") ? link : `https://${link}`,
          };
        });
      }

      if (data.workExperience && data.workExperience.length > 0) {
        newFormData.workExperience = data.workExperience.map((exp) => ({
          company: exp.company || "",
          position: exp.position || "",
          startDate: exp.startDate || "",
          endDate: exp.endDate || "",
          description: exp.description || "",
        }));
      }

      if (data.skills && data.skills.length > 0) {
        newFormData.skills = data.skills;
      }

      if (data.projects && data.projects.length > 0) {
        newFormData.projects = data.projects.map((project) => ({
          name: project.name || "",
          description: project.description || "",
          technology: project.technology || "",
          link: project.link || "",
          imageUrl: project.imageUrl || "",
        }));
      }

      if (data.achievements && data.achievements.length > 0) {
        newFormData.achievements = data.achievements.map((achievement) => ({
          description: achievement.description || "",
          link: achievement.link || "",
        }));
      }

      if (data.education && data.education.length > 0) {
        newFormData.education = data.education.map((edu) => ({
          institution: edu.institution || "",
          degree: edu.degree || "",
          field: edu.field || "",
          startDate: edu.startDate || "",
          endDate: edu.endDate || "",
        }));
      }

      if (data.certifications && data.certifications.length > 0) {
        newFormData.certifications = data.certifications.map((cert) => ({
          name: cert.name || "",
          issuer: cert.issuer || "",
          date: cert.date || "",
          url: cert.url || "",
        }));
      } else {
      }

      setFormData(newFormData);

      localStorage.setItem("portfolioData", JSON.stringify(newFormData));

      toast({
        title: "Resume processed successfully",
        description:
          "Your portfolio information has been extracted from your resume.",
      });

      setShowDataSourceSelection(false);
    } catch (error) {
      console.error("Error processing resume:", error);
      toast({
        title: "Error processing resume",
        description:
          "There was an error extracting information from your resume. Please try again or fill the form manually.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const startFormProcess = () => {
    if (dataSource === "manual") {
      setShowDataSourceSelection(false);
    } else if (dataSource === "ai") {
      if (aiOption === "upload" && file) {
        processResumeWithAI("upload");
      } else if (aiOption === "existing" && selectedResume) {
        processResumeWithAI(selectedResume);
      } else {
        toast({
          title: "Missing information",
          description:
            aiOption === "upload"
              ? "Please select a resume file to upload"
              : "Please select a resume from your existing resumes",
          variant: "destructive",
        });
      }
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      localStorage.setItem("portfolioData", JSON.stringify(formData));
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    localStorage.setItem("portfolioFormData", JSON.stringify(formData));
    setLoader(true);
    try {
      const res = await axios.post("/api/portfolio/portfolio-data", {
        portfolioData: formData,
        portfolio: userData.name,
      });
      if (res.status === 200) {
        toast({
          title: "Portfolio saved successfully",
          description: "Your portfolio has been created.",
        });
        localStorage.setItem("datafetched", "true");
      } else {
        toast({
          title: "Error saving portfolio",
          description: "There was an error saving your portfolio.",
          variant: "destructive",
        });
      }
      await fetchUserData();
      router.push("/portfolio/manage");
    } catch (error) {
      console.error("Error saving portfolio:", error);
      toast({
        title: "Error saving portfolio",
        description: "There was an error saving your portfolio.",
        variant: "destructive",
      });
    } finally {
      setLoader(false);
    }
  };

  const updatePersonalInfo = (
    field: keyof FormData["personalInfo"],
    value: string
  ) => {
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [field]: value,
      },
    });
  };

  const addSocialLink = () => {
    setFormData({
      ...formData,
      socialLinks: [...formData.socialLinks, { platform: "", url: "" }],
    });
  };

  const updateSocialLink = (
    index: number,
    field: keyof SocialLink,
    value: string
  ) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };
    setFormData({
      ...formData,
      socialLinks: updatedLinks,
    });
  };

  const removeSocialLink = (index: number) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks.splice(index, 1);
    setFormData({
      ...formData,
      socialLinks: updatedLinks,
    });
  };

  const addWorkExperience = () => {
    setFormData({
      ...formData,
      workExperience: [
        ...formData.workExperience,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          description: "",
        },
      ],
    });
  };

  const updateWorkExperience = (
    index: number,
    field: keyof WorkExperience,
    value: string
  ) => {
    const updatedExperiences = [...formData.workExperience];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      workExperience: updatedExperiences,
    });
  };

  const removeWorkExperience = (index: number) => {
    const updatedExperiences = [...formData.workExperience];
    updatedExperiences.splice(index, 1);
    setFormData({
      ...formData,
      workExperience: updatedExperiences,
    });
  };

  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, ""],
    });
  };

  const updateSkill = (index: number, value: string) => {
    if (formData.skills.length == 15) return;

    toast({
      title: "Focus on Key Skills",
      description:
        "Listing too many skills can be distracting. Highlight only the most relevant ones.",
    });

    const updatedSkills = [...formData.skills];
    updatedSkills[index] = value;
    setFormData({
      ...formData,
      skills: updatedSkills,
    });
  };

  const removeSkill = (index: number) => {
    const updatedSkills = [...formData.skills];
    updatedSkills.splice(index, 1);
    setFormData({
      ...formData,
      skills: updatedSkills,
    });
  };

  const addProject = () => {
    setFormData({
      ...formData,
      projects: [
        ...formData.projects,
        {
          name: "",
          description: "",
          technology: "",
          link: "",
          imageUrl: "",
        },
      ],
    });
  };

  const updateProject = (
    index: number,
    field: keyof Project,
    value: string
  ) => {
    const updatedProjects = [...formData.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setFormData({
      ...formData,
      projects: updatedProjects,
    });
  };

  const removeProject = (index: number) => {
    const updatedProjects = [...formData.projects];
    updatedProjects.splice(index, 1);
    setFormData({
      ...formData,
      projects: updatedProjects,
    });
  };

  const addAchievement = () => {
    setFormData({
      ...formData,
      achievements: [
        ...formData.achievements,
        {
          description: "",
          link: "",
        },
      ],
    });
  };

  const updateAchievement = (
    index: number,
    field: keyof Achievement,
    value: string
  ) => {
    const updatedAchievements = [...formData.achievements];
    updatedAchievements[index] = {
      ...updatedAchievements[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      achievements: updatedAchievements,
    });
  };

  const removeAchievement = (index: number) => {
    const updatedAchievements = [...formData.achievements];
    updatedAchievements.splice(index, 1);
    setFormData({
      ...formData,
      achievements: updatedAchievements,
    });
  };

  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { institution: "", degree: "", field: "", startDate: "", endDate: "" },
      ],
    });
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const updatedEducation = [...formData.education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    setFormData({
      ...formData,
      education: updatedEducation,
    });
  };

  const removeEducation = (index: number) => {
    const updatedEducation = [...formData.education];
    updatedEducation.splice(index, 1);
    setFormData({
      ...formData,
      education: updatedEducation,
    });
  };

  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [
        ...formData.certifications,
        { name: "", issuer: "", date: "", url: "" },
      ],
    });
  };

  const updateCertification = (
    index: number,
    field: keyof Certification,
    value: string
  ) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications[index] = {
      ...updatedCertifications[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      certifications: updatedCertifications,
    });
  };

  const removeCertification = (index: number) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications.splice(index, 1);
    setFormData({
      ...formData,
      certifications: updatedCertifications,
    });
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (userData?.hasPorfolioData) {
    router.push("/portfolio/manage");
  }
  if (showDataSourceSelection) {
    return (
      <div className=" ">
        <h1 className="text-2xl font-bold mb-6">Create Your Portfolio</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Choose How to Create Your Portfolio</CardTitle>
            <CardDescription>
              You can either fill in your information manually or let AI extract
              it from your resume.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="manual"
              className="w-full"
              onValueChange={(value) => setDataSource(value as "manual" | "ai")}
            >
              <TabsList className="grid w-full grid-cols-2 gap-2 mb-8">
                <TabsTrigger value="manual">
                  <User className="mr-2 md:block hidden h-4 w-4" />
                  Manual Entry
                </TabsTrigger>
                <TabsTrigger value="ai">
                  <FileUp className="mr-2 md:block hidden h-4 w-4" />
                  Extract Resume
                </TabsTrigger>
              </TabsList>

              <TabsContent value="manual" className="space-y-4">
                <div className="text-center py-8">
                  <h3 className="text-lg font-medium mb-2">
                    Fill in Your Information Manually
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    You&apos;ll be guided through a step-by-step form to create
                    your portfolio.
                  </p>
                  <Button onClick={startFormProcess}>Start Creating</Button>
                </div>
              </TabsContent>

              <TabsContent value="ai" className="space-y-6">
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        aiOption === "upload"
                          ? "border-primary bg-primary/5"
                          : "border-muted"
                      }`}
                      onClick={() => setAiOption("upload")}
                    >
                      <div className="flex flex-col items-center justify-center py-4">
                        <Upload className="h-8 w-8 mb-2 text-primary" />
                        <h3 className="font-medium">Upload New Resume</h3>
                        <p className="text-sm text-muted-foreground text-center mt-1">
                          Upload a new resume file to extract information
                        </p>
                      </div>
                    </div>

                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        aiOption === "existing"
                          ? "border-primary bg-primary/5"
                          : "border-muted"
                      }`}
                      onClick={() => setAiOption("existing")}
                    >
                      <div className="flex flex-col items-center justify-center py-4">
                        <FileUp className="h-8 w-8 mb-2 text-primary" />
                        <h3 className="font-medium">Use Existing Resume</h3>
                        <p className="text-sm text-muted-foreground text-center mt-1">
                          Select from your previously uploaded resumes
                        </p>
                      </div>
                    </div>
                  </div>

                  {aiOption === "upload" && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <Label htmlFor="resume-upload">Upload Resume</Label>
                      <Input
                        id="resume-upload"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                      />
                      <p className="text-xs text-muted-foreground">
                        Supported formats: PDF. Maximum size: 5MB
                      </p>
                    </div>
                  )}

                  {aiOption === "existing" && (
                    <div className="space-y-4 p-4 border rounded-lg">
                      <Label htmlFor="resume-select">Select Resume</Label>
                      <Select
                        disabled={userData?.resumes?.length === 0}
                        onValueChange={setSelectedResume}
                        value={selectedResume}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={`${
                              userData.resumes.length == 0
                                ? "No resumes uploaded"
                                : "Select a resume"
                            }`}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {userData?.resumes?.map((r: IResume) => (
                            <SelectItem key={r.shortUrl} value={r.fileUrl}>
                              {r.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                <div className="flex justify-center pt-4">
                  <Button onClick={startFormProcess} disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Extract Information</>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="justify-between">
            <Button
              variant="outline"
              onClick={() => router.push("/portfolio/dashboard")}
            >
              Cancel
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  return (
    <div className=" md:px-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Create Your Portfolio</h1>
        <div className="flex sm:flex-row flex-col  items-center justify-between">
          <div className=" items-center  hidden md:flex space-x-2 overflow-x-auto pb-2 md:pb-0">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <Button
                  onClick={() => setCurrentStep(index)}
                  variant={index === currentStep ? "default" : "secondary"}
                  className={`w-8 h-8 rounded-full flex items-center justify-center`}
                >
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </Button>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-6 ${
                      index < currentStep ? "bg-primary/20" : "bg-muted"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-sm font-medium">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div
          className={`transition-transform duration-500 ease-in-out transform`}
        >
          {currentStep === 0 && (
            <Card>
              <CardHeader className=" p-4">
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Tell us about yourself. All fields are optional.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.personalInfo.name}
                      onChange={(e) =>
                        updatePersonalInfo("name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium">
                      Professional Title
                    </label>
                    <Input
                      id="title"
                      placeholder="Software Engineer"
                      value={formData.personalInfo.title}
                      onChange={(e) =>
                        updatePersonalInfo("title", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.personalInfo.email}
                      onChange={(e) =>
                        updatePersonalInfo("email", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone
                    </label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 123-4567"
                      value={formData.personalInfo.phone}
                      onChange={(e) =>
                        updatePersonalInfo("phone", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="location" className="text-sm font-medium">
                      Location
                    </label>
                    <Input
                      id="location"
                      placeholder="New York, NY"
                      value={formData.personalInfo.location}
                      onChange={(e) =>
                        updatePersonalInfo("location", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="bio" className="text-sm font-medium">
                      Bio
                    </label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us about yourself..."
                      className="min-h-[120px]"
                      value={formData.personalInfo.bio}
                      onChange={(e) =>
                        updatePersonalInfo("bio", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button
                  variant="outline"
                  onClick={() => router.push("/portfolio/dashboard")}
                >
                  Cancel
                </Button>
                <Button onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 1 && (
            <Card>
              <CardHeader className=" p-4">
                <CardTitle>Social Links</CardTitle>
                <CardDescription>
                  Add your social media profiles. All fields are optional.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                {formData.socialLinks.map((link, index) => (
                  <div
                    key={index}
                    className="flex flex-col md:flex-row md:items-end  gap-4 "
                  >
                    <div className="flex-1 space-y-2">
                      <label
                        htmlFor={`platform-${index}`}
                        className="text-sm font-medium"
                      >
                        Platform
                      </label>
                      <Input
                        id={`platform-${index}`}
                        placeholder="LinkedIn, Twitter, GitHub, etc."
                        value={link.platform}
                        onChange={(e) =>
                          updateSocialLink(index, "platform", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <label
                        htmlFor={`url-${index}`}
                        className="text-sm font-medium"
                      >
                        URL
                      </label>
                      <Input
                        id={`url-${index}`}
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) =>
                          updateSocialLink(index, "url", e.target.value)
                        }
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSocialLink(index)}
                      disabled={formData.socialLinks.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addSocialLink}>
                  Add Another Social Link
                </Button>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 2 && (
            <Card>
              <CardHeader className=" p-4">
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>
                  Add your work experience. All fields are optional.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-4">
                {formData.workExperience.map((experience, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Experience {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeWorkExperience(index)}
                        disabled={formData.workExperience.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor={`company-${index}`}
                          className="text-sm font-medium"
                        >
                          Company
                        </label>
                        <Input
                          id={`company-${index}`}
                          placeholder="Acme Inc."
                          value={experience.company}
                          onChange={(e) =>
                            updateWorkExperience(
                              index,
                              "company",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor={`position-${index}`}
                          className="text-sm font-medium"
                        >
                          Position
                        </label>
                        <Input
                          id={`position-${index}`}
                          placeholder="Software Engineer"
                          value={experience.position}
                          onChange={(e) =>
                            updateWorkExperience(
                              index,
                              "position",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor={`startDate-${index}`}
                          className="text-sm font-medium"
                        >
                          Start Date
                        </label>
                        <Input
                          id={`startDate-${index}`}
                          placeholder="MM/YYYY"
                          value={experience.startDate}
                          onChange={(e) =>
                            updateWorkExperience(
                              index,
                              "startDate",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor={`endDate-${index}`}
                          className="text-sm font-medium"
                        >
                          End Date
                        </label>
                        <Input
                          id={`endDate-${index}`}
                          placeholder="MM/YYYY or Present"
                          value={experience.endDate}
                          onChange={(e) =>
                            updateWorkExperience(
                              index,
                              "endDate",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label
                          htmlFor={`description-${index}`}
                          className="text-sm font-medium"
                        >
                          Description
                        </label>
                        <Textarea
                          id={`description-${index}`}
                          placeholder="Describe your responsibilities and achievements..."
                          className="min-h-[100px]"
                          value={experience.description}
                          onChange={(e) =>
                            updateWorkExperience(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addWorkExperience}>
                  Add Another Experience
                </Button>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 3 && (
            <Card>
              <CardHeader className=" p-4">
                <CardTitle>Skills</CardTitle>
                <CardDescription>
                  Add your skills. All fields are optional.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-1 space-y-2">
                      <label
                        htmlFor={`skill-${index}`}
                        className="text-sm font-medium"
                      >
                        Skill {index + 1}
                      </label>
                      <Input
                        id={`skill-${index}`}
                        placeholder="JavaScript, Project Management, etc."
                        value={skill}
                        onChange={(e) => updateSkill(index, e.target.value)}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSkill(index)}
                      disabled={formData.skills.length === 1}
                      className="mt-6"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={addSkill}>
                  Add Another Skill
                </Button>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 4 && (
            <Card>
              <CardHeader className=" p-4">
                <CardTitle>Projects</CardTitle>
                <CardDescription>
                  Add your projects. All fields are optional.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-4">
                {formData.projects.map((project, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Project {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeProject(index)}
                        disabled={formData.projects.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor={`projectName-${index}`}
                          className="text-sm font-medium"
                        >
                          Project Name
                        </label>
                        <Input
                          id={`projectName-${index}`}
                          placeholder="My Awesome Project"
                          value={project.name}
                          onChange={(e) =>
                            updateProject(index, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor={`projectLink-${index}`}
                          className="text-sm font-medium"
                        >
                          Project Link
                        </label>
                        <Input
                          id={`projectLink-${index}`}
                          placeholder="https://github.com/username/project"
                          value={project.link}
                          onChange={(e) =>
                            updateProject(index, "link", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor={`projectTechnology-${index}`}
                          className="text-sm font-medium"
                        >
                          Technologies Used
                        </label>
                        <Input
                          id={`projectTechnology-${index}`}
                          placeholder="React, Node.js, MongoDB"
                          value={project.technology}
                          onChange={(e) =>
                            updateProject(index, "technology", e.target.value)
                          }
                        />
                        <p className="text-xs text-muted-foreground">
                          Separate technologies with commas
                        </p>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor={`projectImage-${index}`}
                          className="text-sm font-medium"
                        >
                          Image URL
                        </label>
                        <Input
                          id={`projectImage-${index}`}
                          placeholder="https://example.com/project-image.jpg"
                          value={project.imageUrl}
                          onChange={(e) =>
                            updateProject(index, "imageUrl", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label
                          htmlFor={`projectDescription-${index}`}
                          className="text-sm font-medium"
                        >
                          Description
                        </label>
                        <Textarea
                          id={`projectDescription-${index}`}
                          placeholder="Describe your project, its features, and what you learned..."
                          className="min-h-[100px]"
                          value={project.description}
                          onChange={(e) =>
                            updateProject(index, "description", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addProject}>
                  Add Another Project
                </Button>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 5 && (
            <Card>
              <CardHeader className=" p-4">
                <CardTitle>Achievements</CardTitle>
                <CardDescription>
                  Add your achievements and awards. All fields are optional.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-4">
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Achievement {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeAchievement(index)}
                        disabled={formData.achievements.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor={`achievementDescription-${index}`}
                          className="text-sm font-medium"
                        >
                          Achievement Description
                        </label>
                        <Textarea
                          id={`achievementDescription-${index}`}
                          placeholder="Describe your achievement, award, or recognition..."
                          className="min-h-[100px]"
                          value={achievement.description}
                          onChange={(e) =>
                            updateAchievement(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor={`achievementLink-${index}`}
                          className="text-sm font-medium"
                        >
                          Link (Optional)
                        </label>
                        <Input
                          id={`achievementLink-${index}`}
                          placeholder="https://example.com/certificate or news article"
                          value={achievement.link}
                          onChange={(e) =>
                            updateAchievement(index, "link", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addAchievement}>
                  Add Another Achievement
                </Button>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 6 && (
            <Card>
              <CardHeader className=" p-4">
                <CardTitle>Education</CardTitle>
                <CardDescription>
                  Add your education. All fields are optional.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-4">
                {formData.education.map((edu, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Education {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeEducation(index)}
                        disabled={formData.education.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor={`institution-${index}`}
                          className="text-sm font-medium"
                        >
                          Institution
                        </label>
                        <Input
                          id={`institution-${index}`}
                          placeholder="University of Example"
                          value={edu.institution}
                          onChange={(e) =>
                            updateEducation(
                              index,
                              "institution",
                              e.target.value
                            )
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor={`degree-${index}`}
                          className="text-sm font-medium"
                        >
                          Degree
                        </label>
                        <Input
                          id={`degree-${index}`}
                          placeholder="Bachelor's, Master's, etc."
                          value={edu.degree}
                          onChange={(e) =>
                            updateEducation(index, "degree", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor={`field-${index}`}
                          className="text-sm font-medium"
                        >
                          Field of Study
                        </label>
                        <Input
                          id={`field-${index}`}
                          placeholder="Computer Science, Business, etc."
                          value={edu.field}
                          onChange={(e) =>
                            updateEducation(index, "field", e.target.value)
                          }
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label
                            htmlFor={`eduStartDate-${index}`}
                            className="text-sm font-medium"
                          >
                            Start Date
                          </label>
                          <Input
                            id={`eduStartDate-${index}`}
                            placeholder="MM/YYYY"
                            value={edu.startDate}
                            onChange={(e) =>
                              updateEducation(
                                index,
                                "startDate",
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor={`eduEndDate-${index}`}
                            className="text-sm font-medium"
                          >
                            End Date
                          </label>
                          <Input
                            id={`eduEndDate-${index}`}
                            placeholder="MM/YYYY or Present"
                            value={edu.endDate}
                            onChange={(e) =>
                              updateEducation(index, "endDate", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addEducation}>
                  Add Another Education
                </Button>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 7 && (
            <Card>
              <CardHeader className=" p-4">
                <CardTitle>Certifications</CardTitle>
                <CardDescription>
                  Add your certifications. All fields are optional.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 p-4">
                {formData.certifications.map((cert, index) => (
                  <div key={index} className="space-y-4 p-4 border rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Certification {index + 1}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCertification(index)}
                        disabled={formData.certifications.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label
                          htmlFor={`certName-${index}`}
                          className="text-sm font-medium"
                        >
                          Certification Name
                        </label>
                        <Input
                          id={`certName-${index}`}
                          placeholder="AWS Certified Solutions Architect"
                          value={cert.name}
                          onChange={(e) =>
                            updateCertification(index, "name", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor={`issuer-${index}`}
                          className="text-sm font-medium"
                        >
                          Issuing Organization
                        </label>
                        <Input
                          id={`issuer-${index}`}
                          placeholder="Amazon Web Services"
                          value={cert.issuer}
                          onChange={(e) =>
                            updateCertification(index, "issuer", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor={`certDate-${index}`}
                          className="text-sm font-medium"
                        >
                          Date Issued
                        </label>
                        <Input
                          id={`certDate-${index}`}
                          placeholder="MM/YYYY"
                          value={cert.date}
                          onChange={(e) =>
                            updateCertification(index, "date", e.target.value)
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor={`certUrl-${index}`}
                          className="text-sm font-medium"
                        >
                          Credential URL
                        </label>
                        <Input
                          id={`certUrl-${index}`}
                          placeholder="https://..."
                          value={cert.url}
                          onChange={(e) =>
                            updateCertification(index, "url", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" onClick={addCertification}>
                  Add Another Certification
                </Button>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}

          {currentStep === 8 && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Portfolio</CardTitle>
                <CardDescription>
                  Review your information before creating your portfolio.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <h3 className="font-semibold">Personal Information</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Name:</div>
                    <div>{formData.personalInfo.name || "Not provided"}</div>
                    <div className="font-medium">Title:</div>
                    <div>{formData.personalInfo.title || "Not provided"}</div>
                    <div className="font-medium">Email:</div>
                    <div>{formData.personalInfo.email || "Not provided"}</div>
                    <div className="font-medium">Phone:</div>
                    <div>{formData.personalInfo.phone || "Not provided"}</div>
                    <div className="font-medium">Location:</div>
                    <div>
                      {formData.personalInfo.location || "Not provided"}
                    </div>
                  </div>
                  <div className="pt-2">
                    <div className="font-medium">Bio:</div>
                    <div className="text-sm mt-1">
                      {formData.personalInfo.bio || "Not provided"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Social Links</h3>
                  {formData.socialLinks.length > 0 &&
                  formData.socialLinks[0].platform ? (
                    <ul className="list-disc pl-5 text-sm space-y-1">
                      {formData.socialLinks.map((link, index) => (
                        <li key={index}>
                          {link.platform}: {link.url || "No URL provided"}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm">No social links provided</p>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Work Experience</h3>
                  {formData.workExperience.length > 0 &&
                  formData.workExperience[0].company ? (
                    <div className="space-y-4">
                      {formData.workExperience.map((exp, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium">
                            {exp.position} at {exp.company}
                          </div>
                          <div>
                            {exp.startDate} - {exp.endDate}
                          </div>
                          <div className="mt-1">{exp.description}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm">No work experience provided</p>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Skills</h3>
                  {formData.skills.length > 0 && formData.skills[0] ? (
                    <div className="flex flex-wrap gap-2">
                      {formData.skills.map((skill, index) => (
                        <div
                          key={index}
                          className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm">No skills provided</p>
                  )}
                </div>

                <div className="space-y-2">
                  {formData.projects.length > 0 && formData.projects[0].name ? (
                    <div className="space-y-4">
                      {formData.projects.map((project, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium">{project.name}</div>
                          <div className="text-muted-foreground">
                            Technologies: {project.technology}
                          </div>
                          <div className="mt-1">{project.description}</div>
                          {project.link && (
                            <div className="text-primary underline">
                              <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View Project
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm">No projects provided</p>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Achievements</h3>
                  {formData.achievements.length > 0 &&
                  formData.achievements[0].description ? (
                    <div className="space-y-4">
                      {formData.achievements.map((achievement, index) => (
                        <div key={index} className="text-sm">
                          <div className="mt-1">{achievement.description}</div>
                          {achievement.link && (
                            <div className="text-primary underline">
                              <a
                                href={achievement.link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View Achievement
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm">No achievements provided</p>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Education</h3>
                  {formData.education.length > 0 &&
                  formData.education[0].institution ? (
                    <div className="space-y-4">
                      {formData.education.map((edu, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium">
                            {edu.degree} in {edu.field}
                          </div>
                          <div>{edu.institution}</div>
                          <div>
                            {edu.startDate} - {edu.endDate}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm">No education provided</p>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Certifications</h3>
                  {formData.certifications.length > 0 &&
                  formData.certifications[0].name ? (
                    <div className="space-y-4">
                      {formData.certifications.map((cert, index) => (
                        <div key={index} className="text-sm">
                          <div className="font-medium">{cert.name}</div>
                          <div>
                            Issued by {cert.issuer} on {cert.date}
                          </div>
                          {cert.url && (
                            <div className="text-primary underline">
                              <a
                                href={cert.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View Credential
                              </a>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm">No certifications provided</p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="justify-between">
                <Button variant="outline" onClick={handlePrevious}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button disabled={loader} onClick={handleSubmit}>
                  {loader ? (
                    "Creating..."
                  ) : (
                    <>
                      Create Portfolio <Check className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
