"use client";

import axios from "axios";
import { UAParser } from "ua-parser-js";

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

export const FetchLocationBrowserData =
  async (): Promise<I_LocationBrowserData> => {
    let device: DeviceInfo | null = null;
    let location: LocationData | null = null;

    const parser = new UAParser();

    const result = parser.getResult();
    console.log(result);
    device = {
      browser: result.browser?.name || "Unknown",
      platform: result.os?.name || "Unknown",
    };

    try {
      const stored =
        typeof window !== "undefined" ? localStorage.getItem("location") : null;

      if (stored) {
        location = JSON.parse(stored);
      } else {
        const res = await axios.get("/api/loc");
        location = res.data;
        localStorage.setItem("location", JSON.stringify(res.data));
      }
    } catch (err) {
      console.error("Failed to fetch location:", err);
    }

    return { location, device };
  };
