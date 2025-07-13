"use client";

import Link from "next/link";
import { SiteNav } from "./site-nav";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "./scroll-reveal";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  FileText,
  Share2,
  Globe,
  PenTool,
  ChevronRight,
  CheckCircle2,
  Upload,
  Eye,
  Download,
  Brain,
} from "lucide-react";
import React, { useState } from "react";

export function LandingPage() {
  const [activeTab, setActiveTab] = useState(0);

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
      image: "/placeholder.svg?height=450&width=800",
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
      image: "/placeholder.svg?height=450&width=800",
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
      image: "/placeholder.svg?height=450&width=800",
    },
    {
      title: "Portfolio Builder",
      description:
        "Create a professional portfolio website to showcase your work and skills alongside your resume.",
      icon: PenTool,
      benefits: [
        "Build portfolio websites",
        "Showcase projects and skills",
        "Professional templates",
        "Mobile-responsive design",
      ],
      image: "/placeholder.svg?height=450&width=800",
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
        "Share with employers easily",
      ],
      image: "/placeholder.svg?height=450&width=800",
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
      image: "/placeholder.svg?height=450&width=800",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <SiteNav />

      {/* Hero Section */}
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
              <ScrollReveal>
                <motion.div
                  className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
                  whileHover={{ scale: 1.05 }}
                >
                  <span>Resume & Portfolio Platform</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </motion.div>
                </motion.div>
              </ScrollReveal>

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
                      <Link href="/p/preview">View Demo</Link>
                    </Button>
                  </motion.div>
                </div>
              </ScrollReveal>
            </div>

            <div className="relative">
              <ScrollReveal>
                <motion.div
                  className="relative aspect-[4/3] rounded-xl overflow-hidden border shadow-2xl"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src="/placeholder.svg?height=600&width=800"
                    alt="Resume Management Dashboard"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent mix-blend-overlay"></div>
                </motion.div>
              </ScrollReveal>

              {/* Analytics Card */}
              <ScrollReveal delay={0.3} direction="down">
                <motion.div
                  className="absolute -top-8 -right-8 w-40 h-32 rounded-lg bg-background border shadow-lg p-3 flex flex-col justify-between hidden sm:flex"
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

              {/* AI Feedback Card */}
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

      {/* Features Overview */}
      <section id="features" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-muted/30 dark:bg-muted/5"></div>

        <motion.div
          className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 15,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <div className="container px-4">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <motion.div
              className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
              whileHover={{ scale: 1.05 }}
            >
              <span>Core Features</span>
            </motion.div>
            <h2 className="text-3xl font-bold">
              Everything You Need for Job Success
            </h2>
            <p className="text-lg text-muted-foreground">
              Streamline your job search with our comprehensive suite of tools
              designed for modern professionals.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Resume Storage",
                description:
                  "Upload and organize your resume files with secure cloud storage.",
                icon: Upload,
                color: "from-blue-500 to-cyan-500",
                stats: "Store multiple versions",
                highlight: "Secure & Organized",
              },
              {
                title: "Performance Analytics",
                description:
                  "Track views, downloads, and engagement metrics for your resumes.",
                icon: BarChart3,
                color: "from-purple-500 to-pink-500",
                stats: "Real-time tracking",
                highlight: "Data-Driven Insights",
              },
              {
                title: "AI-Powered Feedback",
                description:
                  "Get intelligent suggestions to improve your resume content.",
                icon: Brain,
                color: "from-amber-500 to-orange-500",
                stats: "Smart recommendations",
                highlight: "AI Enhancement",
              },
              {
                title: "Easy Sharing",
                description:
                  "Generate shareable links and track when employers view your resume.",
                icon: Share2,
                color: "from-green-500 to-emerald-500",
                stats: "One-click sharing",
                highlight: "Professional Links",
              },
              {
                title: "Portfolio Builder",
                description:
                  "Create stunning portfolio websites to showcase your projects.",
                icon: PenTool,
                color: "from-rose-500 to-red-500",
                stats: "Professional templates",
                highlight: "Stand Out Online",
              },
              {
                title: "Traffic Insights",
                description:
                  "Monitor your portfolio visitors and understand your audience.",
                icon: Globe,
                color: "from-indigo-500 to-violet-500",
                stats: "Visitor analytics",
                highlight: "Know Your Impact",
              },
            ].map((feature, index) => (
              <ScrollReveal key={index} delay={0.1 * index}>
                <motion.div
                  className="group relative overflow-hidden rounded-2xl border bg-background/50 backdrop-blur-sm p-8 shadow-lg transition-all hover:shadow-2xl h-full"
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {/* Background gradient on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                  />

                  {/* Icon with animated background */}
                  <div className="relative mb-6">
                    <motion.div
                      className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                      }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <feature.icon className="h-8 w-8 text-white" />
                    </motion.div>

                    {/* Floating badge */}
                    <motion.div
                      className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full font-medium"
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                    >
                      {feature.highlight}
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-2 text-sm">
                      <motion.div
                        className="h-2 w-2 rounded-full bg-primary"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          delay: index * 0.2,
                        }}
                      />
                      <span className="text-primary font-medium">
                        {feature.stats}
                      </span>
                    </div>

                    {/* Action button */}
                    <motion.div
                      className="pt-4"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <div className="flex items-center text-primary font-medium text-sm group-hover:text-primary/80 transition-colors cursor-pointer">
                        <span>Explore feature</span>
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Decorative elements */}
                  <motion.div
                    className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-primary/5 to-transparent"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 90, 0],
                    }}
                    transition={{
                      duration: 8,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.5,
                    }}
                  />

                  {/* Border glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-primary/20 via-transparent to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(135deg, transparent, ${
                        feature.color.split(" ")[1]?.replace("to-", "") ||
                        "primary"
                      }20, transparent)`,
                      padding: "2px",
                      borderRadius: "1rem",
                    }}
                  />
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          {/* Bottom CTA */}
          <ScrollReveal delay={0.8} >
            <motion.div
              className="text-center mt-16 "
              whileInView={{ y: 0, opacity: 1 }}
              initial={{ y: 20, opacity: 0 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="group relative overflow-hidden"
                  asChild
                >
                  <Link href="/auth/signup">
                    <span className="relative z-10">Try All Features Free</span>
                    <motion.span
                      className="absolute inset-0 bg-primary/80 z-0"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{
                        type: "tween",
                        ease: "easeInOut",
                        duration: 0.3,
                      }}
                    />
                    <ChevronRight className="ml-2 h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </ScrollReveal>
        </div>
      </section>

      {/* Detailed Features Tabs */}
      <section id="detailed-features" className="py-20">
        <div className="container px-4">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold">Features in Detail</h2>
            <p className="text-lg text-muted-foreground">
              Learn more about each feature and how it can help with your job
              search.
            </p>
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
                  <Button className="group" asChild>
                    <Link href="/auth/signup">
                      Try It Now
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>
                <div className="relative">
                  <motion.div
                    className="aspect-video rounded-xl overflow-hidden border shadow-xl"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <img
                      src={features[activeTab].image || "/placeholder.svg"}
                      alt={features[activeTab].title}
                      className="object-cover w-full h-full"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-primary"></div>

        <div className="container px-4">
          <ScrollReveal className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold text-primary-foreground">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-primary-foreground/90">
              Upload your first resume and start building your portfolio today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="group" asChild>
                <Link href="/auth/signup">
                  Sign Up Free
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10 text-primary-foreground"
                asChild
              >
                <Link href="/p/preview">View Demo</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link href="/" className="flex items-center gap-2">
              <motion.div
                className="relative size-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <span className="font-bold text-primary-foreground">R</span>
              </motion.div>
              <span className="font-bold text-xl">ResumeHub</span>
            </Link>

            <p className="text-muted-foreground text-sm">
              Developed by{" "}
              <a
                className="text-primary hover:underline"
                target="_blank"
                href="https://soorajrao.in/?ref=resume-org"
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
