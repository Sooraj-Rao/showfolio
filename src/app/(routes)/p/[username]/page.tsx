"use client";

import { useEffect, useState } from "react";
import One from "../live/1";
import Two from "../live/2";
import Three from "../live/3";

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

const Page = ({ params: { username } }: { params: { username: string } }) => {
  const [loading, setLoading] = useState(false);
  const [portfolioData, setportfolioData] = useState<PortfolioData | null>(
    null
  );
  const [isError, setisError] = useState("");
  const [template, settemplate] = useState("");

  const fetchPortfolioData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/portfolio/get-portfolio?username=${username}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch portfolio data");
      }
      const data = await response.json();
      if (!data?.portfolio) {
        setisError(data?.error?.message);
      }
      setportfolioData(data?.portfolio || null);
      settemplate(data.templateId);
      localStorage.setItem("portfolioData", JSON.stringify(data?.portfolio));
      localStorage.setItem("templateId", data?.templateId);
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPortfolioData();
  }, []);

  if (isError) {
    <div className=" h-screen flex justify-center items-center">{isError}</div>;
  }

  const templates = {
    "1": <One loading={loading} portfolioData={portfolioData} />,
    "2": <Two loading={loading} portfolioData={portfolioData} />,
    "3": <Three loading={loading} portfolioData={portfolioData} />,
  };
  console.log(template);

  return templates[template];
};

export default Page;
