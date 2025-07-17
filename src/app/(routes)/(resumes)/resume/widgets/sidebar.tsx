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
  X,
  Zap,
} from "lucide-react";
import { ModeToggle } from "@/components/main/theme/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

export const ResumeSidebarItems = [
  { name: "Dashboard", href: "/resume/dashboard", icon: Home },
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
    <aside className="w-64 lg:block hidden  h-screen sticky top-4 overflow-auto border-r bg-background">
      <div className="flex flex-col h-full px-4">
        <nav className="flex-1 space-y-2">
          {ResumeSidebarItems.map((item) => {
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
          <ModeToggle title={true} />
          <div className=" pt-5">
            <Link href="/portfolio/dashboard/">
              <Button className="w-full justify-start">
                <StarsIcon className="mr-4 h-4 w-4" />
                Portfolio
              </Button>
            </Link>
          </div>
        </nav>
      </div>
    </aside>
  );
}

export function MobileSidebar({ isOpen, toggleSidebar, SidebarItems }) {
  const pathname = usePathname();
  const isResume = pathname.startsWith("/resume");

    const handleLogout = async () => {
      try {
        const agree = confirm("Are you sure want to logout");
        if (!agree) return;
        const res = await fetch("/api/auth/login", {
          method: "PUT",
        });
        if (!res.ok) {
          throw new Error("Failed to logout");
        } else {
          toast({
            title: "Success",
            description: "Logout successful",
            variant: "default",
          });
          window.location.href = "/";
        }
      } catch {
        toast({
          title: "Failed",
          description: "Failed to logout",
          variant: "destructive",
        });
      }
    };

  return (
    <aside
      className={cn(
        "lg:hidden fixed top-0 duration-300 h-screen left-0 z-[99] w-full   bg-background  transition-transform transform",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex flex-col w-full bg-background h-full px-4 py-6 ">
        <button
          onClick={toggleSidebar}
          className="text-muted-foreground mb-4 self-end"
        >
          <X />
        </button>
        <nav className="flex flex-col space-y-2  mx-auto  bg-background py-5">
          {SidebarItems?.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link onClick={toggleSidebar} key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`text-sm text-muted-foreground my-1 w-full justify-start dark:hover:bg-muted/70
                    ${isActive && " bg-muted dark:bg-muted text-foreground"}
                    `}
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
          <Link
            onClick={toggleSidebar}
            href={`${
              isResume ? "/portfolio/dashboard/" : "/resume/dashboard/"
            }`}
          >
            {!isResume ? (
              <Button>
                <StarsIcon className="mr-2 h-4 w-4" />
                Resumes
              </Button>
            ) : (
              <Button>
                <StarsIcon className="mr-2 h-4 w-4" />
                Portfolio
              </Button>
            )}
          </Link>
          <div className=" py-3">
            <Separator />
          </div>
          <ModeToggle title={true} />
          <div className=" self-center mt-8">
            <Button onClick={handleLogout} variant="outline">
              Logout
            </Button>
          </div>
        </nav>
      </div>
    </aside>
  );
}
