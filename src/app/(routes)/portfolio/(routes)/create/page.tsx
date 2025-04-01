"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Define types for our form data
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
  education: Education[];
  certifications: Certification[];
};

// Initial form data
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

// Steps for the form
const steps = [
  "Personal Information",
  "Social Links",
  "Work Experience",
  "Skills",
  "Education",
  "Certifications",
  "Review",
];

export default function CreatePortfolioPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  // Update the useState hook to load data from localStorage
  const [formData, setFormData] = useState<FormData>(() => {
    // Check if we're in the browser environment
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("portfolioFormData");
      return savedData ? JSON.parse(savedData) : initialFormData;
    }
    return initialFormData;
  });
  const [slideDirection, setSlideDirection] = useState<"left" | "right">(
    "right"
  );

  // Handle next step
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setSlideDirection("right");
      setCurrentStep(currentStep + 1);
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setSlideDirection("left");
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // In a real app, you would save the data to a database here
    localStorage.removeItem("portfolioFormData"); // Clear form data after submission
    router.push("/portfolio/dashboard");
  };

  // Update personal info
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

  // Add social link
  const addSocialLink = () => {
    setFormData({
      ...formData,
      socialLinks: [...formData.socialLinks, { platform: "", url: "" }],
    });
  };

  // Update social link
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

  // Remove social link
  const removeSocialLink = (index: number) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks.splice(index, 1);
    setFormData({
      ...formData,
      socialLinks: updatedLinks,
    });
  };

  // Add work experience
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

  // Update work experience
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

  // Remove work experience
  const removeWorkExperience = (index: number) => {
    const updatedExperiences = [...formData.workExperience];
    updatedExperiences.splice(index, 1);
    setFormData({
      ...formData,
      workExperience: updatedExperiences,
    });
  };

  // Add skill
  const addSkill = () => {
    setFormData({
      ...formData,
      skills: [...formData.skills, ""],
    });
  };

  // Update skill
  const updateSkill = (index: number, value: string) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = value;
    setFormData({
      ...formData,
      skills: updatedSkills,
    });
  };

  // Remove skill
  const removeSkill = (index: number) => {
    const updatedSkills = [...formData.skills];
    updatedSkills.splice(index, 1);
    setFormData({
      ...formData,
      skills: updatedSkills,
    });
  };

  // Add education
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        { institution: "", degree: "", field: "", startDate: "", endDate: "" },
      ],
    });
  };

  // Update education
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

  // Remove education
  const removeEducation = (index: number) => {
    const updatedEducation = [...formData.education];
    updatedEducation.splice(index, 1);
    setFormData({
      ...formData,
      education: updatedEducation,
    });
  };

  // Add certification
  const addCertification = () => {
    setFormData({
      ...formData,
      certifications: [
        ...formData.certifications,
        { name: "", issuer: "", date: "", url: "" },
      ],
    });
  };

  // Update certification
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

  // Remove certification
  const removeCertification = (index: number) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications.splice(index, 1);
    setFormData({
      ...formData,
      certifications: updatedCertifications,
    });
  };

  // Add useEffect to save form data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("portfolioFormData", JSON.stringify(formData));
  }, [formData]);

  return (
    <div className="">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Create Your Portfolio</h1>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index === currentStep
                      ? "bg-primary text-primary-foreground"
                      : index < currentStep
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
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
          className={`transition-transform duration-500 ease-in-out transform ${
            slideDirection === "right" ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {currentStep === 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Tell us about yourself. All fields are optional.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  onClick={() => router.push("/portfolio")}
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
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>
                  Add your social media profiles. All fields are optional.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.socialLinks.map((link, index) => (
                  <div key={index} className="flex items-end gap-4">
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
              <CardHeader>
                <CardTitle>Work Experience</CardTitle>
                <CardDescription>
                  Add your work experience. All fields are optional.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>
                  Add your skills. All fields are optional.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
              <CardHeader>
                <CardTitle>Education</CardTitle>
                <CardDescription>
                  Add your education. All fields are optional.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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

          {currentStep === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
                <CardDescription>
                  Add your certifications. All fields are optional.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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

          {currentStep === 6 && (
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
                <Button onClick={handleSubmit}>
                  Create Portfolio <Check className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
