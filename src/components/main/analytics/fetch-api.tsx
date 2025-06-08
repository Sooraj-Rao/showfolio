"use client";
import axios from "axios";

interface LocationData {
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  ip?: string;
  org?: string;
}

interface DeviceInfo {
  browser: string;
  platform: string;
}

export interface I_LocationBrowserData {
  location: LocationData | null;
  device: DeviceInfo | null;
}

interface NavigatorUAData {
  brands: { brand: string; version: string }[];
  platform: string;
}

export const FetchLocationBrowserData = async () => {
  let device;
  let location;
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
    const brands =
      uaData.brands[0]?.brand ?? uaData.brands.map((b) => b.brand).join(", ");
    device = {
      browser: brands,
      platform: uaData.platform,
    };
  } else {
    device = {
      browser: detectBrowserFromUA(ua),
      platform: nav.platform,
    };
  }

  const stored = localStorage.getItem("location");
  if (stored) {
    location = JSON.parse(stored);
  } else {
    try {
      const res = await axios.get("/api/loc");
      localStorage.setItem("location", JSON.stringify(res.data));
      location = res.data;
    } catch (err) {
      console.error("Failed to fetch location:", err);
    }
  }

  return { location, device };
};
