"use client";

import { ModeToggle } from "@/components/main/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Menu, User } from "lucide-react";
import { useState } from "react";
import { MobileSidebar, ResumeSidebarItems } from "./sidebar";
import { usePathname } from "next/navigation";
import { PortfolioSidebarItems } from "../../portfolio/widgets/sidebar";

export function DashboardHeader() {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const path = usePathname();
  const toggleSidebar = () => setMobileSidebarOpen((prev) => !prev);
  const isResumePage = path.startsWith("/resume");
  const isPortfolioPage = path.startsWith("/portfolio");
  return (
    <header className="border-b bg-background/90 z-[99] backdrop-blur w-full sticky top-0 ">
      <div className="flex h-16 items-center px-4">
        <h2 className="flex-1">Resume Org</h2>
        <div className="items-center space-x-4 lg:flex hidden">
          <ModeToggle />
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
