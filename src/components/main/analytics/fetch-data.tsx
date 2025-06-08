"use client";
import Cookies from "js-cookie";
import { FetchLocationBrowserData } from "./fetch-api";

export interface FetchDataParams {
  event: string;
  resumeId: string;
}

export const AnalyticsData = async ({ event, resumeId }: FetchDataParams) => {
  const isSameEvent = Cookies.get(event);
  if (isSameEvent == resumeId) return;
  if (!resumeId) return;

  const data = await FetchLocationBrowserData();

  try {
    const response = await fetch("/api/analytics-api", {
      method: "POST",
      body: JSON.stringify({ event, resumeId, data }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await response.json();
    if (res.success) {
      Cookies.set(event, resumeId);
    }
  } catch {}
};
