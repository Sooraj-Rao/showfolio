"use client";
import Link from "next/link";
import { BarChart2, Home, Settings, StarsIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart2,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen sticky top-0 overflow-auto border-r bg-background">
      <div className="flex flex-col h-full px-4">
        <nav className="flex-1 space-y-2">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={"/portfolio" + item.href}>
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
              href="/resume/dashboard/"
              className=" bg-rose-600 mt-10 text-white  rounded  w-full py-2 px-4 text-sm flex items-center"
            >
              <StarsIcon className="mr-4 h-4 w-4" />
              Resumes
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  );
}
