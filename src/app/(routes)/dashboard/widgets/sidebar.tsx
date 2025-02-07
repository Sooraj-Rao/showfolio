"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  FileText,
  Home,
  List,
  Settings,
  Share2,
  Upload,
  Zap,
} from "lucide-react";

const sidebarItems = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Resumes", href: "/dashboard/resumes", icon: List },
  { name: "Upload", href: "/dashboard/upload", icon: Upload },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { name: "Share", href: "/dashboard/share", icon: Share2 },
  { name: "AI Feedback", href: "/dashboard/ai", icon: Zap },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r ">
      <div className="flex flex-col h-full">
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center">
            <FileText className="h-6 w-6 mr-2" />
            <span className="font-bold">ResumeAI</span>
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    " text-base my-1  w-full justify-start hover:dark:bg-muted/70 hover:bg-primary/10 ",
                    isActive && " dark:bg-muted bg-primary/20 "
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
