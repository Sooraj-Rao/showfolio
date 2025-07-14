"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { MobileSidebar, ResumeSidebarItems } from "./sidebar";
import { usePathname } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { PortfolioSidebarItems } from "@/app/(routes)/(portfolio)/portfolio/widgets/sidebar";

export function DashboardHeader() {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const path = usePathname();
  const toggleSidebar = () => setMobileSidebarOpen((prev) => !prev);
  const isResumePage = path.startsWith("/resume");
  const isPortfolioPage = path.startsWith("/portfolio");

  const handleLogout = async () => {
    try {
      const agree = confirm("Are you sure want to logout");
      if (!agree) return;
      const res = await fetch("/api/login", {
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
    <header className="border-b bg-background/90 z-[99] backdrop-blur w-full sticky top-0 ">
      <div className="flex h-16 items-center px-4 lg:px-10">
        <h2 className="flex-1 font-semibold text-xl text-primary">Showfolio</h2>

        <Button
          className=" md:block hidden"
          onClick={handleLogout}
          variant="outline"
        >
          Logout
        </Button>
        <Button className=" lg:hidden" onClick={toggleSidebar} variant="ghost">
          <Menu />
        </Button>
        {isResumePage ? (
          <MobileSidebar
            SidebarItems={ResumeSidebarItems}
            isOpen={isMobileSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        ) : isPortfolioPage ? (
          <MobileSidebar
            SidebarItems={PortfolioSidebarItems}
            isOpen={isMobileSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
        ) : null}
      </div>
    </header>
  );
}
