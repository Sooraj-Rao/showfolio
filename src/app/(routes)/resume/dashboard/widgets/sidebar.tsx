import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  Home,
  List,
  Search,
  Settings,
  Share2,
  StarsIcon,
  Upload,
  Zap,
} from "lucide-react";
import { Input } from "@/components/ui/input";

const sidebarItems = [
  { name: "Overview", href: "/resume/dashboard", icon: Home },
  { name: "Resumes", href: "/resume/dashboard/resumes", icon: List },
  { name: "Upload", href: "/resume/dashboard/upload", icon: Upload },
  { name: "Analytics", href: "/resume/dashboard/analytics", icon: BarChart2 },
  { name: "Share", href: "/resume/dashboard/share", icon: Share2 },
  { name: "AI Feedback", href: "/resume/dashboard/ai", icon: Zap },
  { name: "Settings", href: "/resume/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen sticky top-0 overflow-auto border-r bg-background">
      <div className="flex flex-col h-full px-4">
        <form className="flex items-center mb-4 pt-4">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search resumes..." className="pl-8" />
          </div>
        </form>

        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "text-sm text-muted-foreground my-1 w-full justify-start hover:bg-primary/10 dark:hover:bg-muted/70",
                    isActive && "bg-primary/5 dark:bg-muted"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
          <div>
            <Link
              href="/portfolio/dashboard/"
              className=" bg-rose-600 mt-10 text-white  rounded  w-full py-2 px-4 text-sm flex items-center"
            >
              <StarsIcon className="mr-4 h-4 w-4" />
              Portfolio
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  );
}
