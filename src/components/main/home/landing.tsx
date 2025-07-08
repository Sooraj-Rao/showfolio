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
  Sparkles,
  Globe,
  QrCode,
  PenTool,
  ChevronRight,
  MousePointerClick,
  CheckCircle2,
  Palette,
  Link2,
} from "lucide-react";
import React, { useState } from "react";

export function LandingPage() {
  const [activeTab, setActiveTab] = useState(0);

  const features = [
    {
      title: "Smart Document Management",
      description:
        "Store and organize all your resumes, cover letters, and career documents in one secure location with easy access.",
      icon: FileText,
      benefits: [
        "Unlimited storage for all your career documents",
        "Organize by job type, company, or custom categories",
        "Version control to track changes and updates",
        "Secure cloud storage with privacy controls",
      ],
      image: "/placeholder.svg?height=450&width=800",
    },
    {
      title: "AI-Powered Optimization",
      description:
        "Get intelligent suggestions to improve your resume and increase your chances of landing interviews.",
      icon: Sparkles,
      benefits: [
        "Keyword optimization for ATS compatibility",
        "Content suggestions based on job descriptions",
        "Grammar and style improvements",
        "Industry-specific recommendations",
      ],
      image: "/placeholder.svg?height=450&width=800",
    },
    {
      title: "Advanced Analytics",
      description:
        "Track views, downloads, and engagement with detailed analytics to optimize your applications.",
      icon: BarChart3,
      benefits: [
        "Real-time tracking of resume views and downloads",
        "Engagement metrics for each section of your resume",
        "Comparison tools for different resume versions",
        "Insights on which skills and experiences attract attention",
      ],
      image: "/placeholder.svg?height=450&width=800",
    },
    {
      title: "Custom Portfolio Builder",
      description:
        "Create a beautiful portfolio website to showcase your projects, skills, and experience.",
      icon: Palette,
      benefits: [
        "Beautiful, customizable templates",
        "Showcase projects with rich media galleries",
        "Integrated blog for sharing your insights",
        "Mobile-responsive design for all devices",
      ],
      image: "/placeholder.svg?height=450&width=800",
    },
    {
      title: "Easy Sharing & Custom Domain",
      description:
        "Share your resume with custom links and QR codes, plus get your own personalized subdomain.",
      icon: Link2,
      benefits: [
        "Custom shareable links for each document",
        "QR codes for easy sharing on business cards",
        "Your own custom subdomain (you.resumehub.com)",
        "Privacy controls to manage who can view your content",
      ],
      image: "/placeholder.svg?height=450&width=800",
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
              <ScrollReveal>
                <motion.div
                  className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
                  whileHover={{ scale: 1.05 }}
                >
                  <span>Introducing ResumeHub</span>
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
                  Elevate Your{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
                    Career Presence
                  </span>
                </h1>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <p className="text-xl text-muted-foreground">
                  The all-in-one platform for managing resumes, creating
                  portfolios, and optimizing your job search with AI-powered
                  insights.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button
                      size="lg"
                      className="group relative overflow-hidden"
                    >
                      <span className="relative z-10">Get Started Free</span>
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
                      <ChevronRight className="ml-1 h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button size="lg" variant="outline">
                      See Demo
                    </Button>
                  </motion.div>
                </div>
              </ScrollReveal>
            </div>

            <div className="relative">
              <ScrollReveal direction="left">
                <motion.div
                  className="relative aspect-[4/3] rounded-xl overflow-hidden border shadow-2xl"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src="/placeholder.svg?height=600&width=800"
                    alt="ResumeHub Dashboard"
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent mix-blend-overlay"></div>
                </motion.div>
              </ScrollReveal>

              <ScrollReveal delay={0.3} direction="down">
                <motion.div
                  className="absolute -top-8 -right-8 w-40 h-40 rounded-lg bg-background border shadow-lg p-3 flex flex-col justify-between hidden sm:flex"
                  whileHover={{ y: -5, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-xs text-muted-foreground">
                    Resume Analytics
                  </div>
                  <div className="flex-1 flex items-center justify-center">
                    <motion.div
                      className="relative h-20 w-20 rounded-full bg-muted flex items-center justify-center"
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 8,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "linear",
                      }}
                    >
                      <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent"></div>
                      <div className="text-sm font-bold">85%</div>
                    </motion.div>
                  </div>
                  <div className="text-xs text-center text-muted-foreground">
                    Engagement Rate
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
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, 0, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        repeatDelay: 3,
                      }}
                    >
                      <Sparkles className="h-4 w-4 text-primary" />
                    </motion.div>
                    <div className="text-sm font-medium">
                      Skills section is strong!
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    Consider adding more quantifiable achievements.
                  </div>
                </motion.div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

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
              <span>Key Features</span>
            </motion.div>
            <h2 className="text-3xl font-bold">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground">
              Our platform provides all the tools you need to manage your career
              documents and stand out from the crowd.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Smart Document Storage",
                description:
                  "Store and organize all your resumes, cover letters, and career documents in one secure location.",
                icon: FileText,
                color: "from-blue-500 to-cyan-500",
              },
              {
                title: "Advanced Analytics",
                description:
                  "Track views, downloads, and engagement with detailed analytics to optimize your applications.",
                icon: BarChart3,
                color: "from-purple-500 to-pink-500",
              },
              {
                title: "AI-Powered Feedback",
                description:
                  "Get intelligent suggestions to improve your resume and increase your chances of landing interviews.",
                icon: Sparkles,
                color: "from-amber-500 to-orange-500",
              },
              {
                title: "Easy Sharing Options",
                description:
                  "Share your resume with custom links and QR codes that you can include on business cards or profiles.",
                icon: Share2,
                color: "from-green-500 to-emerald-500",
              },
              {
                title: "Custom Portfolio Builder",
                description:
                  "Create a beautiful portfolio website to showcase your projects, skills, and experience.",
                icon: PenTool,
                color: "from-rose-500 to-red-500",
              },
              {
                title: "Personal Domain",
                description:
                  "Get your own custom subdomain (you.resumehub.com) to make your profile easily discoverable.",
                icon: Globe,
                color: "from-indigo-500 to-violet-500",
              },
            ].map((feature, index) => (
              <ScrollReveal key={index} delay={0.05 * index}>
                <motion.div
                  className="group relative overflow-hidden rounded-xl border bg-background p-6 shadow-md transition-all hover:shadow-xl h-full"
                  whileHover={{ y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="mb-4">
                    <motion.div
                      className={`h-12 w-12 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                  <div className="mt-6">
                    <motion.div
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Button
                        variant="ghost"
                        className="group p-0 h-auto font-medium text-primary"
                      >
                        Learn more
                        <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </motion.div>
                  </div>

                  <motion.div
                    className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(90deg, ${feature.color
                        .replace("from-", "")
                        .replace("to-", "")})`,
                      zIndex: -1,
                      filter: "blur(8px)",
                    }}
                  />
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section id="features" className="py-20">
        <div className="container px-4">
          <ScrollReveal className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <motion.div
              className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
              whileHover={{ scale: 1.05 }}
            >
              <span>Key Features</span>
            </motion.div>
            <h2 className="text-3xl font-bold">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground">
              Our platform provides all the tools you need to manage your career
              documents and stand out from the crowd.
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
                    <span>{feature.title}</span>
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
                    <motion.div
                      className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {React.createElement(features[activeTab].icon, {
                        className: "h-5 w-5 text-primary",
                      })}
                    </motion.div>
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
                        <motion.div
                          whileHover={{ scale: 1.2, rotate: 5 }}
                          className="mt-0.5"
                        >
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        </motion.div>
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <Button className="group">
                      Learn More
                      <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </motion.div>
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
                    <motion.div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-6 text-white">
                        <h3 className="text-xl font-bold">
                          {features[activeTab].title}
                        </h3>
                        <p className="text-sm opacity-80">
                          Click to explore this feature
                        </p>
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="absolute -z-10 -bottom-6 -right-6 w-32 h-32 rounded-full bg-primary/10"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "reverse",
                    }}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      <section
        id="portfolio"
        className="py-20 bg-muted/50 dark:bg-muted/5 relative overflow-hidden"
      >
        <motion.div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            y: [0, -30, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative">
              <ScrollReveal>
                <motion.div
                  className="aspect-[3/4] rounded-xl overflow-hidden border shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src="/placeholder.svg?height=800&width=600"
                    alt="Portfolio Example"
                    className="object-cover w-full h-full"
                  />
                  <motion.div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-xl font-bold">
                        John Doe&apos;s Portfolio
                      </h3>
                      <p className="text-sm opacity-80">
                        Full-stack developer & UI/UX designer
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </ScrollReveal>

              <ScrollReveal delay={0.2} direction="up">
                <motion.div
                  className="absolute -top-6 -right-6 w-48 rounded-lg bg-background border shadow-lg p-3 hidden sm:block"
                  whileHover={{ y: -5, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-xs text-muted-foreground mb-2">
                    Your Custom Domain
                  </div>
                  <div className="flex items-center gap-2 bg-muted/50 rounded-md px-3 py-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <div className="text-sm font-medium">
                      yourname.resumehub.com
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>

              <ScrollReveal delay={0.3} direction="left">
                <motion.div
                  className="absolute -bottom-6 -left-6 w-40 h-40 rounded-lg bg-background border shadow-lg p-3 flex items-center justify-center hidden sm:flex"
                  whileHover={{ y: -5, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 1, 0, -1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <QrCode className="h-20 w-20 text-primary" />
                  </motion.div>
                </motion.div>
              </ScrollReveal>
            </div>

            <div className="order-1 md:order-2 space-y-6">
              <ScrollReveal>
                <motion.div
                  className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
                  whileHover={{ scale: 1.05 }}
                >
                  <span>Portfolio Builder</span>
                </motion.div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <h2 className="text-3xl font-bold">
                  Create a Stunning Portfolio Website
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <p className="text-lg text-muted-foreground">
                  Showcase your skills, projects, and experience with a
                  beautiful portfolio website that stands out from the crowd.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="space-y-4">
                  {[
                    "Choose from beautiful, customizable templates",
                    "Showcase your projects with rich media galleries",
                    "Highlight your skills and experience",
                    "Share your thoughts with an integrated blog",
                    "Get a custom domain for a professional online presence",
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        className="mt-0.5"
                      >
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      </motion.div>
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button className="group relative overflow-hidden">
                    <span className="relative z-10">Create Your Portfolio</span>
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
                    <ArrowRight className="ml-1 h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section id="analytics" className="py-20 relative overflow-hidden">
        <motion.div
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <ScrollReveal>
                <motion.div
                  className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary"
                  whileHover={{ scale: 1.05 }}
                >
                  <span>Smart Analytics</span>
                </motion.div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <h2 className="text-3xl font-bold">
                  Track Your Resume Performance
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <p className="text-lg text-muted-foreground">
                  Get detailed insights into how your resumes are performing.
                  See who&apos;s viewing your documents and optimize for better
                  results.
                </p>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="space-y-4">
                  {[
                    "Track views, downloads, and engagement metrics",
                    "See which sections of your resume get the most attention",
                    "Compare performance across different resume versions",
                    "Get AI-powered suggestions for improvements",
                    "Share your resume with QR codes and track scans",
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * i }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        className="mt-0.5"
                      >
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                      </motion.div>
                      <span>{item}</span>
                    </motion.div>
                  ))}
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.4}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button className="group relative overflow-hidden">
                    <span className="relative z-10">Explore Analytics</span>
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
                    <ArrowRight className="ml-1 h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              </ScrollReveal>
            </div>

            <div className="relative">
              <ScrollReveal direction="left">
                <motion.div
                  className="aspect-square rounded-xl overflow-hidden border shadow-xl"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <img
                    src="/placeholder.svg?height=700&width=700"
                    alt="Analytics Dashboard"
                    className="object-cover w-full h-full"
                  />
                  <motion.div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-6 text-white">
                      <h3 className="text-xl font-bold">Resume Analytics</h3>
                      <p className="text-sm opacity-80">
                        Track performance and optimize your resume
                      </p>
                    </div>
                  </motion.div>
                </motion.div>
              </ScrollReveal>

              <ScrollReveal delay={0.3} direction="up">
                <motion.div
                  className="absolute -top-6 -left-6 w-48 rounded-lg bg-background border shadow-lg p-3 hidden sm:block"
                  whileHover={{ y: -5, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-xs text-muted-foreground mb-2">
                    Resume Performance
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Views</div>
                      <motion.div
                        className="text-sm font-medium"
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatDelay: 5,
                        }}
                      >
                        128
                      </motion.div>
                    </div>
                    <motion.div
                      className="h-2 bg-muted rounded-full overflow-hidden"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                    >
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        whileInView={{ width: "75%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.5 }}
                      />
                    </motion.div>
                  </div>
                  <div className="space-y-2 mt-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm">Downloads</div>
                      <motion.div
                        className="text-sm font-medium"
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatDelay: 7,
                        }}
                      >
                        43
                      </motion.div>
                    </div>
                    <motion.div
                      className="h-2 bg-muted rounded-full overflow-hidden"
                      initial={{ width: 0 }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 1 }}
                    >
                      <motion.div
                        className="h-full bg-primary"
                        initial={{ width: 0 }}
                        whileInView={{ width: "50%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, delay: 0.7 }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              </ScrollReveal>

              <ScrollReveal delay={0.4} direction="right">
                <motion.div
                  className="absolute -bottom-6 -right-6 w-32 h-32 rounded-lg bg-background border shadow-lg p-3 hidden sm:flex items-center justify-center"
                  whileHover={{ y: -5, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.05, 1],
                      rotate: [0, 2, 0, -2, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                    }}
                  >
                    <MousePointerClick className="h-16 w-16 text-primary" />
                  </motion.div>
                </motion.div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-primary"></div>

        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-foreground/10 via-transparent to-transparent"
          animate={{
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        />

        <div className="container px-4">
          <ScrollReveal className="max-w-3xl mx-auto text-center space-y-8">
            <motion.h2
              className="text-3xl font-bold text-primary-foreground"
              animate={{
                scale: [1, 1.01, 1],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              Ready to Take Your Career to the Next Level?
            </motion.h2>
            <p className="text-xl text-primary-foreground/90">
              Join thousands of professionals who are using ResumeHub to land
              their dream jobs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" variant="secondary" className="group">
                  Get Started Free
                  <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-primary-foreground/20 hover:bg-primary-foreground/10 text-primary-foreground"
                >
                  Watch Demo
                </Button>
              </motion.div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="py-12 border-t">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="md:w-1/3">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <motion.div
                  className="relative size-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <span className="font-bold text-primary-foreground">R</span>
                </motion.div>
                <span className="font-bold text-xl">ResumeHub</span>
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:w-2/3">
              {[
                {
                  title: "Product",
                  links: ["Features", "Templates", "Analytics", "Portfolio"],
                },
                {
                  title: "Company",
                  links: ["About", "Blog", "Careers", "Contact"],
                },
                {
                  title: "Legal",
                  links: ["Privacy", "Terms", "Cookies"],
                },
              ].map((column, i) => (
                <div key={i}>
                  <h3 className="font-semibold mb-4">{column.title}</h3>
                  <ul className="space-y-2">
                    {column.links.map((link, j) => (
                      <motion.li key={j} whileHover={{ x: 2 }}>
                        <Link
                          href="#"
                          className="text-muted-foreground hover:text-primary transition-colors"
                        >
                          {link}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-8 flex justify-between border-t text-center text-sm text-muted-foreground">
            <p>
              &copy; {new Date().getFullYear()} ResumeHub. All rights reserved.
            </p>
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
