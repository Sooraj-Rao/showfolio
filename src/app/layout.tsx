import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "@/components/main/theme/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { Suspense } from "react";

function LoadingFallback() {
  return <div className="text-center p-4">Loading...</div>;
}

export const metadata: Metadata = {
  title: "Resume Manager",
  description: "Manage, share, and track your resumes",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={GeistSans.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
