"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface LocationData {
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  ip?: string;
  org?: string;
}

interface BrowserInfo {
  browser: string;
  platform: string;
  userAgent: string;
}

export interface I_LocationBrowserData {
  location: LocationData | null;
  browser: BrowserInfo | null;
}

interface NavigatorUAData {
  brands: { brand: string; version: string }[];
  platform: string;
}

export const useLocationBrowserData = (): I_LocationBrowserData => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [browser, setBrowser] = useState<BrowserInfo | null>(null);

  const fetchData = async () => {
    const nav = navigator;
    const ua = nav.userAgent;

    const detectBrowserFromUA = (ua: string): string => {
      if (ua.includes("Firefox/")) return "Firefox";
      if (ua.includes("Edg/")) return "Edge";
      if (ua.includes("Brave")) return "Brave";
      if (ua.includes("Chrome/")) return "Chrome";
      if (ua.includes("Safari/") && !ua.includes("Chrome")) return "Safari";
      return "Unknown";
    };

    if ("userAgentData" in nav && nav.userAgentData) {
      const uaData = nav.userAgentData as NavigatorUAData;
      const brands = uaData.brands.map((b) => b.brand).join(", ");
      setBrowser({
        browser: brands,
        platform: uaData.platform,
        userAgent: ua,
      });
    } else {
      setBrowser({
        browser: detectBrowserFromUA(ua),
        platform: nav.platform,
        userAgent: ua,
      });
    }

    const stored = localStorage.getItem("location");
    if (stored) {
      setLocation(JSON.parse(stored));
    } else {
      try {
        const res = await axios.get("https://ipinfo.io/json");
        localStorage.setItem("location", JSON.stringify(res.data));
        setLocation(res.data);
      } catch (err) {
        console.error("Failed to fetch location:", err);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { location, browser };
};
