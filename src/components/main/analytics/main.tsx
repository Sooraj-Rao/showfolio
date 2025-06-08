"use client";

import { useEffect, useRef } from "react";
import { useLocationBrowserData } from "./fetch-api";
import { AnalyticsData } from "./fetch-data";

const Analytics = ({ shortUrl }: { shortUrl: string }) => {
  const fetchDataCalled = useRef(false);
  const { location, device } = useLocationBrowserData();

  const handleAnalytics = async () => {
    AnalyticsData({
      eventType: "resume_view",
      resumeId: shortUrl,
      data: { location, device },
    });
    fetchDataCalled.current = true;
  };

  useEffect(() => {
    if (!fetchDataCalled.current && location) handleAnalytics();
  }, [location, fetchDataCalled]);

  return null;
};

export default Analytics;
