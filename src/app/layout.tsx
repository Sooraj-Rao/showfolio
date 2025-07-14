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
  title: {
    default: "Showfolio",
    template: "%s | Showfolio",
  },
  description:
    "Showfolio helps you create and share all your resumes and portfolios in one place. Quick setup, clean design, and easy sharing — just drop your stuff and go.",
  keywords: [
    "Showfolio",
    "Resume Builder",
    "Portfolio Maker",
    "Job Applications",
    "Professional Links",
    "Resume Sharing",
    "Creative Portfolio",
  ],
  authors: [
    { name: "Sooraj Rao", url: "https://www.linkedin.com/in/sooraj-rao" },
  ],
  creator: "Sooraj Rao",
  metadataBase: new URL("https://showfolio.soorajrao.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://showfolio.soorajrao.in",
    title: "Showfolio",
    description:
      "Share your resumes, projects, and portfolios with one clean link. Built for creatives and professionals who want to stand out.",
    siteName: "Showfolio",
    images: [
      {
        url: "https://showfolio.soorajrao.in/home.png",
        width: 1200,
        height: 630,
        alt: "Showfolio - Your Work, One Link",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Showfolio",
    description:
      "All your resumes and portfolios in one clean link. Easy to set up, even easier to share.",
    creator: "@SooorajRaoo",
    images: ["https://showfolio.soorajrao.in/home.png"],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
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
