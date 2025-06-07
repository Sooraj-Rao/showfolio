import { I_LocationBrowserData } from "@/components/main/resume/fetch-location";

export const trackEvent = async (
  event: string,
  resumeId: string,
  locationBrowserData: I_LocationBrowserData
) => {
  try {
    await fetch("/api/analytics", {
      method: "POST",
      body: JSON.stringify({ event, resumeId, data: locationBrowserData }),
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Analytics error", e);
  }
};
