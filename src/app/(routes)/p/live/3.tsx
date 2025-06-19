"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Mail,
  MapPin,
  Trophy,
  Briefcase,
  GraduationCap,
  Code,
  Sparkles,
  ChevronDown,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

type PortfolioData = {
  personalInfo: {
    name: string
    title: string
    email: string
    phone: string
    location: string
    bio: string
  }
  socialLinks: Array<{
    platform: string
    url: string
  }>
  workExperience: Array<{
    company: string
    position: string
    startDate: string
    endDate: string
    description: string
  }>
  skills: string[]
  projects: Array<{
    name: string
    description: string
    technology: string
    link: string
    imageUrl: string
  }>
  achievements: Array<{
    description: string
    link: string
  }>
  education: Array<{
    institution: string
    degree: string
    field: string
    startDate: string
    endDate: string
  }>
  certifications: Array<{
    name: string
    issuer: string
    date: string
    url: string
  }>
  blogs: Array<{
    title: string
    date: string
    description: string
  }>
}

export default function PortfolioAnimated() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("hero")
  const { toast } = useToast()

  const heroRef = useRef<HTMLElement>(null)
  const aboutRef = useRef<HTMLElement>(null)
  const projectsRef = useRef<HTMLElement>(null)
  const skillsRef = useRef<HTMLElement>(null)
  const achievementsRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLElement>(null)

  useEffect(() => {
    fetchPortfolioData()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "hero", ref: heroRef },
        { id: "about", ref: aboutRef },
        { id: "projects", ref: projectsRef },
        { id: "skills", ref: skillsRef },
        { id: "achievements", ref: achievementsRef },
        { id: "contact", ref: contactRef },
      ]

      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        if (section.ref.current) {
          const { offsetTop, offsetHeight } = section.ref.current
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const fetchPortfolioData = async () => {
    try {
      const response = await fetch("/api/portfolio/portfolio-data")
      if (!response.ok) {
        throw new Error("Failed to fetch portfolio data")
      }
      const data = await response.json()
      setPortfolioData(data.portfolio || data)
    } catch (error) {
      console.error("Error fetching portfolio data:", error)
      const savedData = localStorage.getItem("portfolioData")
      if (savedData) {
        setPortfolioData(JSON.parse(savedData))
      } else {
        toast({
          title: "Error loading portfolio",
          description: "Could not load portfolio data",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const hasData = (section: keyof PortfolioData) => {
    if (!portfolioData) return false
    const data = portfolioData[section]
    if (Array.isArray(data)) {
      return (
        data.length > 0 &&
        data.some((item) => {
          if (typeof item === "string") return item.trim() !== ""
          return Object.values(item).some((value) => value && value.toString().trim() !== "")
        })
      )
    }
    if (typeof data === "object") {
      return Object.values(data).some((value) => value && value.toString().trim() !== "")
    }
    return false
  }

  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    ref.current?.scrollIntoView({ behavior: "smooth" })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-400"></div>
            <div className="absolute inset-0 animate-pulse">
              <Sparkles className="w-8 h-8 text-purple-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          <p className="mt-4 text-xl font-semibold">Loading amazing portfolio...</p>
        </div>
      </div>
    )
  }

  if (!portfolioData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-2xl font-bold">Portfolio data not found</p>
          <p className="text-purple-300 mt-2">Please check your portfolio setup</p>
        </div>
      </div>
    )
  }

  const availableSections = [
    { key: "hero", label: "Home", ref: heroRef },
    {
      key: "about",
      label: "About",
      ref: aboutRef,
      condition: portfolioData.personalInfo?.bio || hasData("workExperience") || hasData("education"),
    },
    { key: "projects", label: "Projects", ref: projectsRef, condition: hasData("projects") },
    { key: "skills", label: "Skills", ref: skillsRef, condition: hasData("skills") },
    { key: "achievements", label: "Achievements", ref: achievementsRef, condition: hasData("achievements") },
    { key: "contact", label: "Contact", ref: contactRef },
  ].filter((section) => section.condition !== false)

  return (
    <div className="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      {/* Floating Navigation */}
      <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-black/20 backdrop-blur-lg rounded-full px-6 py-3 border border-white/10">
        <div className="flex gap-6">
          {availableSections.map((item) => (
            <button
              key={item.key}
              onClick={() => scrollToSection(item.ref)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                activeSection === item.key
                  ? "bg-purple-500 text-white shadow-lg shadow-purple-500/25"
                  : "text-purple-200 hover:text-white hover:bg-white/10"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        <div className="text-center z-10 max-w-4xl mx-auto px-8">
          <div className="relative mb-8">
            <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-purple-400/50 shadow-2xl shadow-purple-500/25 animate-float">
              <Image
                src="/placeholder.svg?height=192&width=192"
                alt="Profile"
                width={192}
                height={192}
                className="object-cover"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-400 rounded-full animate-ping"></div>
          </div>

          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
            {portfolioData.personalInfo?.name || "Your Name"}
          </h1>

          <p className="text-2xl md:text-3xl text-purple-200 mb-8 animate-fade-in-up delay-300">
            {portfolioData.personalInfo?.title || "Your Title"}
          </p>

          {portfolioData.personalInfo?.bio && (
            <p className="text-lg text-purple-100 max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-in-up delay-500">
              {portfolioData.personalInfo.bio}
            </p>
          )}

          <div className="flex flex-wrap justify-center gap-4 mb-12 animate-fade-in-up delay-700">
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              onClick={() => scrollToSection(projectsRef)}
            >
              <Code className="mr-2 h-5 w-5" />
              View My Work
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
              onClick={() => scrollToSection(contactRef)}
            >
              <Mail className="mr-2 h-5 w-5" />
              Get In Touch
            </Button>
          </div>

          {hasData("socialLinks") && (
            <div className="flex justify-center gap-6 animate-fade-in-up delay-1000 mb-12">
              {portfolioData.socialLinks?.map((link, index) => (
                <button
                  key={index}
                  onClick={() => window.open(link.url, "_blank")}
                  className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 transform hover:scale-110 hover:rotate-12"
                >
                  {link.platform.toLowerCase().includes("linkedin") && <Linkedin className="w-6 h-6" />}
                  {link.platform.toLowerCase().includes("github") && <Github className="w-6 h-6" />}
                  {link.platform.toLowerCase().includes("twitter") && <Twitter className="w-6 h-6" />}
                  {!["linkedin", "github", "twitter"].some((platform) =>
                    link.platform.toLowerCase().includes(platform),
                  ) && <ExternalLink className="w-6 h-6" />}
                </button>
              ))}
            </div>
          )}

          <div className="animate-bounce">
            <ChevronDown className="w-8 h-8 mx-auto text-purple-300" />
          </div>
        </div>
      </section>

      {/* About Section */}
      {(portfolioData.personalInfo?.bio || hasData("workExperience") || hasData("education")) && (
        <section ref={aboutRef} className="min-h-screen py-20 px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              About Me
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
              <div className="space-y-6">
                {portfolioData.personalInfo?.bio && (
                  <p className="text-lg text-purple-100 leading-relaxed">{portfolioData.personalInfo.bio}</p>
                )}
              </div>
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-3xl backdrop-blur-sm border border-white/10"></div>
              </div>
            </div>

            {hasData("workExperience") && (
              <div className="mb-16">
                <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
                  <Briefcase className="w-8 h-8 text-purple-400" />
                  Work Experience
                </h3>
                <div className="space-y-6">
                  {portfolioData.workExperience?.map((exp, index) => (
                    <Card
                      key={index}
                      className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                    >
                      <CardContent className="p-6">
                        <h4 className="text-xl font-semibold text-purple-300 mb-2">{exp.position}</h4>
                        <p className="text-purple-200 mb-2">{exp.company}</p>
                        <p className="text-purple-400 text-sm mb-4">
                          {exp.startDate} - {exp.endDate}
                        </p>
                        {exp.description && <p className="text-purple-100">{exp.description}</p>}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {hasData("education") && (
              <div className="mb-16">
                <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
                  <GraduationCap className="w-8 h-8 text-purple-400" />
                  Education
                </h3>
                <div className="space-y-6">
                  {portfolioData.education?.map((edu, index) => (
                    <Card
                      key={index}
                      className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                    >
                      <CardContent className="p-6">
                        <h4 className="text-xl font-semibold text-purple-300 mb-2">
                          {edu.degree} {edu.field && `in ${edu.field}`}
                        </h4>
                        <p className="text-purple-200 mb-2">{edu.institution}</p>
                        <p className="text-purple-400 text-sm">
                          {edu.startDate} - {edu.endDate}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {hasData("certifications") && (
              <div>
                <h3 className="text-3xl font-bold mb-8 flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-purple-400" />
                  Certifications
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {portfolioData.certifications?.map((cert, index) => (
                    <Card
                      key={index}
                      className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                    >
                      <CardContent className="p-6">
                        <h4 className="text-xl font-semibold text-purple-300 mb-2">{cert.name}</h4>
                        <p className="text-purple-200 mb-2">{cert.issuer}</p>
                        <p className="text-purple-400 text-sm mb-4">{cert.date}</p>
                        {cert.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(cert.url, "_blank")}
                            className="border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
                          >
                            View Certificate <ExternalLink className="ml-1 h-3 w-3" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {hasData("projects") && (
        <section ref={projectsRef} className="min-h-screen py-20 px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              My Projects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {portfolioData.projects?.map((project, index) => (
                <Card
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-500 transform hover:scale-105 hover:rotate-1 group overflow-hidden"
                >
                  {project.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={project.imageUrl || "/placeholder.svg"}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-purple-300 mb-3 group-hover:text-pink-300 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-purple-100 mb-4 text-sm leading-relaxed">{project.description}</p>
                    {project.technology && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.technology.split(",").map((tech, techIndex) => (
                          <Badge
                            key={techIndex}
                            variant="secondary"
                            className="bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30 transition-colors"
                          >
                            {tech.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {project.link && (
                      <Button
                        onClick={() => window.open(project.link, "_blank")}
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full transition-all duration-300 transform hover:scale-105"
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

      {/* Skills Section */}
      {hasData("skills") && (
        <section ref={skillsRef} className="min-h-screen py-20 px-8 flex items-center">
          <div className="max-w-6xl mx-auto w-full">
            <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Skills & Technologies
            </h2>

            <div className="flex flex-wrap justify-center gap-4">
              {portfolioData.skills?.map((skill, index) => (
                <div
                  key={index}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-white/10 rounded-full text-purple-200 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 transform hover:scale-110 hover:-rotate-2 cursor-default"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Achievements Section */}
      {hasData("achievements") && (
        <section ref={achievementsRef} className="min-h-screen py-20 px-8 flex items-center">
          <div className="max-w-6xl mx-auto w-full">
            <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Achievements
            </h2>

            <div className="space-y-6">
              {portfolioData.achievements?.map((achievement, index) => (
                <Card
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105"
                >
                  <CardContent className="p-6 flex items-start gap-4">
                    <Trophy className="w-8 h-8 text-yellow-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-purple-100 mb-2">{achievement.description}</p>
                      {achievement.link && (
                        <Button
                          variant="link"
                          onClick={() => window.open(achievement.link, "_blank")}
                          className="text-purple-400 hover:text-purple-300 p-0 h-auto"
                        >
                          View Achievement <ExternalLink className="ml-1 h-3 w-3" />
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

      {/* Contact Section */}
      <section ref={contactRef} className="min-h-screen py-20 px-8 flex items-center">
        <div className="max-w-4xl mx-auto text-center w-full">
          <h2 className="text-5xl font-bold mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Let's Connect
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {portfolioData.personalInfo?.email && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <Mail className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-purple-300 mb-2">Email</h3>
                  <p className="text-purple-100">{portfolioData.personalInfo.email}</p>
                </CardContent>
              </Card>
            )}

            {portfolioData.personalInfo?.location && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <MapPin className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-purple-300 mb-2">Location</h3>
                  <p className="text-purple-100">{portfolioData.personalInfo.location}</p>
                </CardContent>
              </Card>
            )}

            {portfolioData.personalInfo?.phone && (
              <Card className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6 text-center">
                  <span className="text-4xl mb-4 block">📞</span>
                  <h3 className="text-xl font-semibold text-purple-300 mb-2">Phone</h3>
                  <p className="text-purple-100">{portfolioData.personalInfo.phone}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {hasData("socialLinks") && (
            <div className="flex justify-center gap-6">
              {portfolioData.socialLinks?.map((link, index) => (
                <button
                  key={index}
                  onClick={() => window.open(link.url, "_blank")}
                  className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 hover:rotate-12 shadow-lg hover:shadow-xl"
                >
                  {link.platform.toLowerCase().includes("linkedin") && <Linkedin className="w-8 h-8" />}
                  {link.platform.toLowerCase().includes("github") && <Github className="w-8 h-8" />}
                  {link.platform.toLowerCase().includes("twitter") && <Twitter className="w-8 h-8" />}
                  {!["linkedin", "github", "twitter"].some((platform) =>
                    link.platform.toLowerCase().includes(platform),
                  ) && <ExternalLink className="w-8 h-8" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        .delay-300 { animation-delay: 300ms; }
        .delay-500 { animation-delay: 500ms; }
        .delay-700 { animation-delay: 700ms; }
        .delay-1000 { animation-delay: 1000ms; }
      `}</style>
    </div>
  )
}
