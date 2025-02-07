"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Moon,
  Sun,
  Search,
  Briefcase,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function PortfolioDisplay() {
  const [activeSection, setActiveSection] = useState("portfolio");
  const [activeBlogPost, setActiveBlogPost] = useState<string | null>(null);

  const renderContent = () => {
    if (activeBlogPost) {
      return (
        <div className="space-y-8">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => setActiveBlogPost(null)}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>

          <article className="space-y-6">
            <h1 className="text-4xl font-bold">
              From Concepts to Code: My Journey as a Full-Stack Developer
            </h1>

            <div className="prose prose-invert max-w-none">
              <p>
                At 17, I've found myself immersed in a world of creativity,
                experimentation, and—let's be honest—endless lines of code.
                Being a full-stack developer isn't just a skill set; it's a
                mindset. The thrill of building projects from scratch, watching
                ideas turn into reality with just a bit of logic and a lot of
                caffeine, is what keeps me hooked.
              </p>

              <p>
                My favorite tools? Next.js has to be at the top of the list,
                allowing me to build sleek, fast web apps with ease. Pair that
                with Prisma for efficient database management, and you're set.
                Recently, I've dived deep into building interactive websites,
                from multiplayer chess games to treasure hunts, always looking
                for unique ways to push boundaries and create fun experiences.
              </p>

              <p>
                Why code? It's more than just problem-solving—it's the rush of
                creativity, the satisfaction of building something new, and the
                endless possibilities that tech offers. Whether it's a Web3
                project, a SaaS app, or something experimental, I'm always
                chasing that next innovative idea. Excited to see where this
                journey takes me next!
              </p>
            </div>

            <Badge variant="secondary">Introduction</Badge>

            <div className="mt-12 border-t border-gray-800 pt-8">
              <h2 className="text-2xl font-semibold mb-4">Comments</h2>
              <p className="text-gray-400">Coming Soon!</p>
            </div>
          </article>
        </div>
      );
    }

    switch (activeSection) {
      case "about":
        return (
          <div className="space-y-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold">About Me</h2>
              <p className="text-gray-300 leading-relaxed">
                Fun-Fact:- I built this platform (devp). I'm a 17-year-old
                full-stack developer with a deep passion for building and
                experimenting with innovative projects. Whether it's working
                with front-end technologies like Next.js or handling complex
                back-end logic, I love the challenge of bringing ideas to life
                through code. Constantly learning and exploring new tools and
                frameworks, I'm always pushing myself to improve and stay on the
                cutting edge of web development. I thrive on solving problems
                and turning concepts into functional, polished products. From
                personal experiments to collaborative projects, I'm driven by
                curiosity and the thrill of creating something new from scratch.
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                <h2 className="text-2xl font-bold">Work Experience</h2>
              </div>
              <p className="text-gray-400">No Experiences Added</p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                <h2 className="text-2xl font-bold">Education</h2>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">
                  Computer Systems Technology CST
                </h3>
                <p className="text-gray-400">BCIT, Downtown | 2025 - 2027</p>
              </div>
            </section>
          </div>
        );

      case "blog":
        return (
          <div className="space-y-6">
            <Card
              className="bg-gray-900 border-gray-800"
              onClick={() => setActiveBlogPost("journey")}
            >
              <CardContent className="p-6 space-y-4">
                <h2 className="text-2xl font-bold hover:text-gray-300 cursor-pointer">
                  From Concepts to Code: My Journey as a Full-Stack Developer
                </h2>
                <p className="text-sm text-gray-400">
                  Posted on Sat Sep 21 2024
                </p>
                <p className="text-gray-300">
                  At 17, I've found myself immersed in a w...
                </p>
                <div className="flex justify-between items-center">
                  <Button variant="secondary" size="sm">
                    Read More
                  </Button>
                  <Badge variant="outline">Introduction</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return (
          <>
            <div className="flex justify-between items-center mb-8">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search in Projects"
                  className="pl-10 bg-gray-900 border-gray-800"
                />
              </div>
              <Select defaultValue="latest">
                <SelectTrigger className="w-32 bg-transparent border-gray-800">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.title}
                  className="bg-gray-900 rounded-lg overflow-hidden"
                >
                  <div className="relative h-48">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold mb-2">
                      {project.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-1 bg-gray-800 rounded-md text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <Button variant="secondary" size="sm" className="gap-2">
                        <Github className="w-4 h-4" />
                        GitHub
                      </Button>
                      <Button variant="secondary" size="sm">
                        Live Demo
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Left Sidebar */}
      <div className="w-[400px] p-8 border-r border-gray-800">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-48 h-48 rounded-full overflow-hidden mb-4">
            <Image
              src=""
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold mb-1">Tushit Garg</h1>
          <p className="text-gray-400 mb-4">Full Stack Developer</p>

          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {[
              "NextJS",
              "React",
              "Node.js",
              "Express",
              "TypeScript",
              "Angular",
              "HTML/CSS",
              "SQL",
              "Postgres",
              "MongoDB",
              "Vercel",
            ].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1 bg-gray-800 rounded-full text-sm"
              >
                {tech}
              </span>
            ))}
          </div>

          <Button variant="outline" className="mb-8">
            Resume
          </Button>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Contact Info</h2>
          <div className="space-y-3 text-gray-400">
            <div className="flex items-center gap-2">
              <span>📧</span>
              <span>tushitgarg123@gmail.com</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>Vancouver, Canada</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💼</span>
              <span>Available for hire</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Social Links</h2>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon">
              <Linkedin className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Github className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Twitter className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <nav className="flex gap-6">
            <Button
              variant="link"
              className={
                activeSection === "portfolio" ? "text-white" : "text-gray-400"
              }
              onClick={() => setActiveSection("portfolio")}
            >
              Portfolio
            </Button>
            <Button
              variant="link"
              className={
                activeSection === "about" ? "text-white" : "text-gray-400"
              }
              onClick={() => setActiveSection("about")}
            >
              About
            </Button>
            <Button
              variant="link"
              className={
                activeSection === "blog" ? "text-white" : "text-gray-400"
              }
              onClick={() => setActiveSection("blog")}
            >
              Blog
            </Button>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Sun className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Moon className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {renderContent()}
      </div>
    </div>
  );
}

const projects = [
  {
    title: "Sushinime",
    description:
      "A working Complete anime watching website inspired by Netflix!",
    image: "",
    technologies: ["NextJS", "ReactJS", "Typescript", "Consumet", "Redis"],
  },
  {
    title: "Paste Vault",
    description:
      "A Simple Rust App which records and stores the clipboard history in real time made with tauri, rust",
    image: "",
    technologies: ["Rust", "Tauri", "Rust", "Typescript"],
  },
  {
    title: "Sushi Stash API",
    description: "Added Api Support for developers to use free image hosting",
    image: "",
    technologies: ["NextJS"],
  },
  {
    title: "Sushi Stash",
    description: "Unlimited Image Hosting Provider!",
    image: "",
    technologies: ["NextJS", "Typescript", "Postgres", "Shadcn"],
  },
  {
    title: "DevP",
    description: "A CMS for Developer Portfolios!",
    image: "",
    technologies: ["NextJS", "ReactJS", "Typescript", "Shadcn"],
  },
  {
    title: "Ping Pilot",
    description: "A cutting-edge web application for real-time Monitoring.",
    image: "",
    technologies: ["NextJS", "Typescript", "Postgres"],
  },
];
