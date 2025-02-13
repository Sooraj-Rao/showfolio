import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { ArrowRight, BarChart2, FileText, Share2, Shield } from "lucide-react";
import { SiteNav } from "./site-nav";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <SiteNav />
      <section className="pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="container px-4 space-y-12">
          <div className="max-w-[640px] space-y-6">
            <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm">
              <span className="text-muted-foreground">
                October Product Updates
              </span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Smart Resume Management for the Modern Job Search
            </h1>
            <p className="text-xl text-muted-foreground">
              Track applications, analyze performance, and optimize your job
              search with AI-powered insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/auth/signup">Try it for free</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/demo">View demo</Link>
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t">
            <div className="space-y-2">
              <h3 className="text-3xl font-bold">50K+</h3>
              <p className="text-sm text-muted-foreground">Active Users</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold">100K+</h3>
              <p className="text-sm text-muted-foreground">Resumes Tracked</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold">85%</h3>
              <p className="text-sm text-muted-foreground">Success Rate</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold">4.9/5</h3>
              <p className="text-sm text-muted-foreground">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-50">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold">
                Everything you need to manage your job search
              </h2>
              <p className="text-lg text-muted-foreground">
                Track applications, analyze performance, and get insights to
                improve your success rate.
              </p>
              <div className="grid gap-4">
                {[
                  {
                    title: "Resume Analytics",
                    description:
                      "Track views, downloads, and engagement with your resumes",
                    icon: BarChart2,
                  },
                  {
                    title: "Smart Organization",
                    description:
                      "Organize resumes by job type, company, or custom categories",
                    icon: FileText,
                  },
                  {
                    title: "Secure Sharing",
                    description:
                      "Share resumes securely with custom links and tracking",
                    icon: Share2,
                  },
                  {
                    title: "Privacy Controls",
                    description:
                      "Control who can view your resumes and for how long",
                    icon: Shield,
                  },
                ].map((feature) => (
                  <Card key={feature.title} className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="mt-1">
                        <feature.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-square rounded-xl border bg-background shadow-lg">
                {/* Replace with actual app screenshot */}
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 to-cyan-500/20 rounded-xl" />
              </div>
              <div className="absolute -bottom-6 -right-6 w-2/3 aspect-square rounded-xl border bg-background shadow-lg">
                {/* Replace with actual analytics screenshot */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-rose-500/20 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Demo Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold">See it in action</h2>
            <p className="text-lg text-muted-foreground">
              Watch how ResumeAI helps you manage your job search more
              effectively.
            </p>
            <div className="aspect-video rounded-xl border bg-slate-50 shadow-lg">
              {/* Replace with actual product demo video/animation */}
              <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">Product Demo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="container px-4">
          <div className="max-w-[640px] mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold">
              Start optimizing your job search today
            </h2>
            <p className="text-lg text-slate-300">
              Join thousands of job seekers who are using ResumeAI to land their
              dream jobs.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">Get started for free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/features"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/updates"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Updates
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/careers"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/docs"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/help"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guides"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Guides
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/privacy"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2023 ResumeAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
