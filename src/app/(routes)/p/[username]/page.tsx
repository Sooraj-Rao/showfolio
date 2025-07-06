"use client";

import { useEffect, useState } from "react";
import One from "../live/1";
import Two from "../live/2";
import Three from "../live/3";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

type PortfolioData = {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
  };
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
  workExperience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  skills: string[];
  projects: Array<{
    name: string;
    description: string;
    technology: string;
    link: string;
    imageUrl: string;
  }>;
  achievements: Array<{
    description: string;
    link: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }>;
  certifications: Array<{
    name: string;
    issuer: string;
    date: string;
    url: string;
  }>;
  blogs: Array<{
    title: string;
    date: string;
    description: string;
  }>;
};

const PortfolioParentPage = ({
  analytics,
  params,
}: {
  analytics?: boolean;
  params?: { username?: string };
}) => {
  let username = params?.username || "";
  const SearchParams = useSearchParams();
  const ref = SearchParams.get("ref") || "";
  const [loading, setLoading] = useState(false);
  const [portfolioData, setportfolioData] = useState<PortfolioData | null>(
    null
  );
  const [isError, setisError] = useState("");
  const [template, settemplate] = useState("");

  const fetchPortfolioData = async () => {
    setLoading(true);
    try {
      if (!username && SearchParams.get("username")) {
        username = SearchParams.get("username");
      }
      if (!username) setisError("Username is required to fetch portfolio data");

      const response = await axios.get(
        `/api/portfolio/get-portfolio?username=${username}`
      );
      if (!response || response.status !== 200) {
        setisError(response.data?.error || "Failed to fetch portfolio data");
        return;
      }

      if (!response.data?.portfolio) {
        setisError(response.data?.error?.message);
        return;
      }
      response.data.portfolio.analytics = analytics === false ? false : true;
      response.data.portfolio.ref = ref;
      response.data.portfolio.theme = response.data.theme;
      response.data.portfolio.imageUrl = response.data.imageUrl;
      response.data.portfolio.themeMode = response.data.themeMode;
      setportfolioData(response.data?.portfolio || null);
      settemplate(response.data.templateId);
      localStorage.setItem(
        "portfolioData",
        JSON.stringify(response.data?.portfolio)
      );
      localStorage.setItem("templateId", response.data?.templateId);
    } catch (error) {
      console.log(error);
      setisError(
        error?.response?.data?.error ||
          "An error occurred while fetching portfolio data"
      );
      console.error("Error fetching portfolio data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPortfolioData();
  }, []);

  if (isError) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-6 bg-gray-900 text-white px-4">
        <h1 className="text-2xl font-bold">Oops! Something went wrong.</h1>
        <p className="text-lg text-red-400">{isError.toString()}</p>
        <a href="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft size={18} />
            Go Back Home
          </Button>
        </a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const templates = {
    "1": <One portfolioData={portfolioData} />,
    "2": <Two portfolioData={portfolioData} />,
    "3": <Three portfolioData={portfolioData} />,
  };

  return templates[template];
};

export default PortfolioParentPage;
