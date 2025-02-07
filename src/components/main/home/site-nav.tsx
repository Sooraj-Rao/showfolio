"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScroll } from "@/app/hooks/use-scroll";

export function SiteNav() {
  const scrolled = useScroll(50);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-40 bg-background/0 transition-all",
        scrolled && "bg-background/80 backdrop-blur-sm border-b"
      )}
    >
      <nav className="container flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">ResumeAI</span>
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/features"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/updates"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Updates
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Button  asChild>
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
