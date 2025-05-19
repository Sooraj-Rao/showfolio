"use client";
import { DashboardHeader } from "./widgets/header";
import { Sidebar } from "./widgets/sidebar";
import { usePathname } from "next/navigation";
import { RouteTitle } from "@/data/route-names";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();
  const title = RouteTitle[path]?.title;
  const desc = RouteTitle[path]?.desc;

  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader />
      {title && desc && (
        <div className="sticky top-14 bg-background/95 z-[90] py-4 px-24 border-b">
          <h2 className="text-2xl font-bold tracking-tight">
            Resume {"-"} {title}
          </h2>
          <p className="text-sm text-muted-foreground">{desc}</p>
        </div>
      )}
      <div className="flex flex-1 overflow-hidden px-20 pt-3">
        <Sidebar />
        <main className="flex-1 p-8 pt-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
