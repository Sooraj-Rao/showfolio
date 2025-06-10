"use client";
import { DashboardHeader } from "./widgets/header";
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
        <main className="flex-1 p-8 pt-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
