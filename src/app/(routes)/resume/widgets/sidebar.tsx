import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart2,
  Home,
  List,
  Settings,
  Share2,
  StarsIcon,
  Upload,
  Zap,
} from "lucide-react";

const sidebarItems = [
  { name: "Overview", href: "/resume/dashboard", icon: Home },
  { name: "Resumes", href: "/resume/resumes", icon: List },
  { name: "Upload", href: "/resume/upload", icon: Upload },
  { name: "Analytics", href: "/resume/analytics", icon: BarChart2 },
  { name: "Share", href: "/resume/share", icon: Share2 },
  { name: "AI Feedback", href: "/resume/ai", icon: Zap },
  { name: "Settings", href: "/resume/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64  h-screen sticky top-0 overflow-auto border-r bg-background">
      <div className="flex flex-col h-full px-4">
        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "text-sm text-muted-foreground my-1 w-full justify-start  dark:hover:bg-muted/70",
                    isActive && " bg-muted dark:bg-muted text-foreground"
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
