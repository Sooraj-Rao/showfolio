"use client";
import useGetUserData from "@/app/hooks/use-getUserData";
import { Sidebar } from "./widgets/sidebar";
import { usePathname } from "next/navigation";
import { RouteTitle } from "@/data/route-names";
import { DashboardHeader } from "../resume/dashboard/widgets/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {} = useGetUserData();
  const path = usePathname();

  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader />
      <div className="sticky top-14 bg-background/95 z-[90] py-4 px-24 border-b">
        <h2 className="text-3xl font-bold tracking-tight">
          {RouteTitle[path]?.title || "none"}
        </h2>
        <p className="text-muted-foreground">
          {RouteTitle[path]?.desc || "none"}
        </p>
      </div>
      <div className="flex flex-1 overflow-hidden px-20 pt-3">
        <Sidebar />
        <main className="flex-1 p-8 pt-6  overflow-auto">{children}</main>
      </div>
    </div>
  );
}
