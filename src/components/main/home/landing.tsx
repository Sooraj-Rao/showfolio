/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { SiteNav } from "./site-nav";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "./scroll-reveal";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  FileText,
  Share2,
  Globe,
  PenTool,
  ChevronRight,
  CheckCircle2,
  Eye,
  Download,
  Brain,
} from "lucide-react";
import React, { useState } from "react";
import { useTheme } from "next-themes";

export function LandingPage() {
  const [activeTab, setActiveTab] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const features = [
    {
      title: "Resume Management",
      description:
        "Upload and store your resumes securely. Keep track of different versions and organize them by job applications.",
      icon: FileText,
      benefits: [
        "Upload and store multiple resume files",
        "Organize resumes by job applications",
        "Secure cloud storage",
        "Easy access from anywhere",
      ],
      image: !isDark ? "/feat/resumes/light.png" : "/feat/resumes/dark.png",
    },
    {
      title: "AI Resume Feedback",
      description:
        "Get AI-powered suggestions to improve your resume content and increase your chances with job applications.",
      icon: Brain,
      benefits: [
        "AI analysis of resume content",
        "Suggestions for improvement",
        "Content optimization tips",
        "Job-specific recommendations",
      ],
      image: !isDark ? "/feat/ai/light.png" : "/feat/ai/dark.png",
    },
    {
      title: "Resume Analytics",
      description:
        "Track who views and downloads your shared resumes. See which resumes perform better.",
      icon: BarChart3,
      benefits: [
        "Track resume views and downloads",
        "See engagement on shared links",
        "Compare resume performance",
        "View analytics dashboard",
      ],
      image: !isDark
        ? "/feat/res-analytics/light.png"
        : "/feat/res-analytics/dark.png",
    },
    {
      title: "Portfolio Builder",
      description:
        "Create a professional portfolio website to showcase your work and skills alongside your resume.",
      icon: PenTool,
      benefits: [
        "Build portfolio websites",
        "Showcase projects and skills",
        "Theme choice",
        "Mobile-responsive design",
      ],
      image: !isDark ? "/feat/portfolio/light.png" : "/feat/portfolio/dark.png",
    },
    {
      title: "Easy Sharing",
      description:
        "Share your resume with custom links. Track when someone views or downloads your resume.",
      icon: Share2,
      benefits: [
        "Generate shareable links",
        "Track link clicks",
        "Monitor downloads",
        "Custom referrers",
      ],
      image: !isDark ? "/feat/share/light.png" : "/feat/share/dark.png",
    },
    {
      title: "Portfolio Analytics",
      description:
        "Get insights into your portfolio website traffic and see how visitors interact with your content.",
      icon: Globe,
      benefits: [
        "Website traffic analytics",
        "Visitor behavior insights",
        "Page performance metrics",
        "Traffic source tracking",
      ],
      image: !isDark
        ? "/feat/p-analytics/light.png"
        : "/feat/p-analytics/dark.png",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <SiteNav />

      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/30 dark:from-background dark:to-background"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>

          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>

        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <ScrollReveal delay={0.1}>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Manage Your{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    Resumes
                  </span>{" "}
                  & Build Your{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    Portfolio
                  </span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <p className="text-xl text-muted-foreground">
                  Store your resumes, get AI feedback, track performance with
                  analytics, and build a professional portfolio website.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button size="lg" className="group" asChild>
                      <Link href="/auth/signup">
                        Get Started
                        <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button size="lg" variant="outline" asChild>
                      <Link href="/p/soorajrao?ref=site_hero_page">
                        View Demo
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </ScrollReveal>
            </div>

            <div className="relative">
              <ScrollReveal>
                <motion.div
                  className="relative aspect-[4.5/3] rounded-xl overflow-hidden border shadow-2xl"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src={
                      isDark ? "/home/hero/dark.png" : "/home/hero/light.png"
                    }
                    alt="Resume Management Dashboard"
                    className="object-cover  w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent mix-blend-overlay"></div>
                </motion.div>
              </ScrollReveal>

              <ScrollReveal delay={0.3} direction="down">
                <motion.div
                  className="absolute -top-8 -right-8 w-40  rounded-lg bg-background border shadow-lg p-3 gap-2  flex-col justify-between hidden sm:flex"
                  whileHover={{ y: -5, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-xs text-muted-foreground">
                    Resume Stats
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Eye className="h-3 w-3 text-blue-500" />
                      <span className="text-xs">Views: 47</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Download className="h-3 w-3 text-green-500" />
                      <span className="text-xs">Downloads: 12</span>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>

              <ScrollReveal delay={0.4} direction="right">
                <motion.div
                  className="absolute -bottom-8 -left-8 w-48 rounded-lg bg-background border shadow-lg p-3 hidden sm:block"
                  whileHover={{ y: -5, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-xs text-muted-foreground mb-2">
                    AI Feedback
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <div className="text-sm font-medium">
                      Good skills section
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Add more specific achievements
                  </div>
                </motion.div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section id="detailed-features" className="py-20">
        <div className="container px-4">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold">Features</h2>
          </ScrollReveal>

          <div className="mb-10">
            <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12">
              {features.map((feature, index) => (
                <motion.button
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                  onClick={() => setActiveTab(index)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center gap-2">
                    <feature.icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{feature.title}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid md:grid-cols-2 gap-12 items-center"
              >
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {React.createElement(features[activeTab].icon, {
                        className: "h-5 w-5 text-primary",
                      })}
                    </div>
                    <h3 className="text-2xl font-semibold">
                      {features[activeTab].title}
                    </h3>
                  </div>
                  <p className="text-lg text-muted-foreground">
                    {features[activeTab].description}
                  </p>
                  <div className="space-y-4">
                    {features[activeTab].benefits.map((item, i) => (
                      <motion.div key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="relative">
                  <motion.div
                    className=" rounded-xl  scale-110 overflow-hidden border shadow-xl"
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={features[activeTab].image || "/placeholder.svg"}
                      alt={features[activeTab].title}
                      className="   w-full h-full"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr  from-primary/80 via-primary/20 to-primary/10"></div>

        <div className="container px-4">
          <ScrollReveal className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold text-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-foreground/90">
              Upload your first resume and start building your portfolio today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="default2" className="group" asChild>
                <Link href="/auth/signup">
                  Sign Up
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10 text-foreground"
                asChild
              >
                <Link href="/p/soorajrao?ref=site_hero_page">View Demo</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="py-12 border-t">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Logo />
            <p className="text-muted-foreground text-sm">
              Developed by{" "}
              <a
                className="text-primary hover:underline"
                target="_blank"
                href="https://soorajrao.in/?ref=showfolio"
                rel="noreferrer"
              >
                Sooraj Rao
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export const Logo = () => (
  <Link href="/" className="flex items-center gap-2">
    <motion.div
      className="relative size-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center"
      whileHover={{ scale: 1.1, rotate: 5 }}
    >
      <span className="font-bold text-primary-foreground">S</span>
    </motion.div>
    <span className="font-bold text-xl">Showfolio</span>
  </Link>
);
