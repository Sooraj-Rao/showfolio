"use client";
import Cookies from "js-cookie";
import { I_LocationBrowserData } from "./fetch-api";

export interface FetchDataParams {
  eventType: string;
  resumeId: string;
  data: I_LocationBrowserData;
}

export const AnalyticsData = async ({
  eventType,
  resumeId,
  data,
}: FetchDataParams) => {
  const isSameEvent = Cookies.get(eventType);
  if (isSameEvent == resumeId) return;
  if (!resumeId || !data) return;

  try {
    const response = await fetch("/api/analytics", {
      method: "POST",
      body: JSON.stringify({ event: eventType, resumeId, data }),
      headers: { "Content-Type": "application/json" },
    });
    const res = await response.json();
    if (res.success) {
      Cookies.set(eventType, resumeId);
    }
  } catch (err) {
    console.log(err);
  }
};
