"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useScroll } from "@/app/hooks/use-scroll";
import { ModeToggle } from "../theme/theme-toggle";
import { Logo } from "./landing";

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
        <Logo />
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/#features"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Features
          </Link>
          <Link
            href="/about"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href="/p/soorajrao?ref=site_hero_page"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Demo
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <ModeToggle />
          <Button asChild>
            <Link href="/auth/login">Sign in</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
