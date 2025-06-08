"use client";

import { useEffect, useRef } from "react";
import { AnalyticsData } from "./fetch-data";

const Analytics = ({ shortUrl }: { shortUrl: string }) => {
  const fetchDataCalled = useRef(false);

  const handleAnalytics = async () => {
    fetchDataCalled.current = true;
    AnalyticsData({
      event: "view:resume",
      resumeId: shortUrl,
    });
  };

  useEffect(() => {
    if (!fetchDataCalled.current) handleAnalytics();
  }, [fetchDataCalled]);

  return null;
};

export default Analytics;
