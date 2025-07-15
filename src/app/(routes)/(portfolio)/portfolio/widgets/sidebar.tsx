"use client";
import Link from "next/link";
import { BarChart2, Home, Settings, StarsIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useGetUserData from "@/app/hooks/use-getUserData";
import { ModeToggle } from "@/components/main/theme/theme-toggle";

export const PortfolioSidebarItems = [
  {
    name: "Dashboard",
    href: "/portfolio/dashboard",
    icon: Home,
  },
  {
    name: "Create",
    href: "/portfolio/create",
    icon: Home,
  },
  {
    name: "Manage",
    href: "/portfolio/manage",
    icon: Home,
  },
  {
    name: "Analytics",
    href: "/portfolio/analytics",
    icon: BarChart2,
  },
  {
    name: "Settings",
    href: "/portfolio/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { userData } = useGetUserData();

  return (
    <aside className="w-64 lg:block hidden  h-screen sticky top-0 overflow-auto border-r bg-background">
      <div className="flex flex-col h-full px-4">
        <nav className="flex-1 space-y-2">
          {PortfolioSidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                className={
                  userData?.hasPorfolioData && item.name == "Create" && "hidden"
                }
                key={item.href}
                href={"" + item.href}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "text-sm text-muted-foreground my-1 w-full justify-start hover:bg-black/5 dark:hover:bg-muted/70",
                    isActive && " bg-black/10 dark:bg-muted text-foreground"
                  )}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
          <ModeToggle title={true} />
          <div className=" pt-5">
            <Link href="/resume/dashboard/">
              <Button>
                <StarsIcon className="mr-4 h-4 w-4" />
                Resumes
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  );
}
