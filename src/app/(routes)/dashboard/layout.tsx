"use client";
import useGetUserData from "@/app/hooks/use-getUserData";
import { DashboardHeader } from "./widgets/header";
import { Sidebar } from "./widgets/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {} = useGetUserData();
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1">
        <DashboardHeader />
        <main className="flex-1 space-y-4 p-8 pt-6">{children}</main>
      </div>
    </div>
  );
}
