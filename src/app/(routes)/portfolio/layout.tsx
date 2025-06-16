"use client";
import { DashboardHeader } from "../resume/widgets/header";
import { Sidebar } from "./widgets/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      <DashboardHeader />
      <div className="flex flex-1 overflow-hidden px-1 pt-3">
        <Sidebar />
        <main className="flex-1 lg:p-8 p-4 pt-3 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
