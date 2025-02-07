"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  FileText,
  FolderOpen,
  Home,
  Share2,
  Tag,
  Upload,
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Resumes", href: "/dashboard/resumes", icon: FileText },
  { name: "Folders", href: "/dashboard/folders", icon: FolderOpen },
  { name: "Tags", href: "/dashboard/tags", icon: Tag },
  { name: "Sharing", href: "/dashboard/sharing", icon: Share2 },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-background border-r h-screen">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-center h-16 border-b">
          <h1 className="text-xl font-bold">Resume Manager</h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-2 px-2">
            {sidebarItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href} passHref>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      pathname === item.href && "bg-accent"
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t">
          <Button className="w-full" variant="default">
            <Upload className="mr-2 h-4 w-4" /> Upload Resume
          </Button>
        </div>
      </div>
    </aside>
  );
}
