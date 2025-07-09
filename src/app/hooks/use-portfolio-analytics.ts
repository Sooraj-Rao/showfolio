/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";

interface LocationData {
  city: string;
  region: string;
  country: string;
  countryCode: string;
}

interface AnalyticsEvent {
  sessionId: string;
  page: string;
  section?: string;
  anchor?: string;
  event: string;
  timeSpent?: number;
  scrollDepth?: number;
  clickTarget?: string;
  screenResolution?: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  referrer?: string;
  user?:string
}

export function usePortfolioAnalyticsEnhanced(
  isPreview = false,
  userId: string
) {
  const sessionId = useRef<string>("");
  const locationData = useRef<LocationData | null>(null);
  const pageStartTime = useRef<number>(Date.now());
  const lastScrollDepth = useRef<number>(0);
  const referrer = useRef<string | null>(null);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const storedSessionId = sessionStorage.getItem("portfolio_session_id");
    if (storedSessionId) {
      sessionId.current = storedSessionId;
    } else {
      sessionId.current = uuidv4();
      sessionStorage.setItem("portfolio_session_id", sessionId.current);
    }

    const urlParams = new URLSearchParams(window.location.search);
    const refParam = urlParams.get("ref");
    referrer.current = refParam || document.referrer || null;

    fetchLocationData();

    trackEvent("page_view");

    startHeartbeat();

    const handleScroll = throttle(() => {
      const scrollDepth = Math.round(
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
          100
      );

      if (scrollDepth > lastScrollDepth.current && scrollDepth % 25 === 0) {
        lastScrollDepth.current = scrollDepth;
        trackEvent("scroll_depth", { scrollDepth });
      }
    }, 1000);

    window.addEventListener("scroll", handleScroll);

    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - pageStartTime.current) / 1000);
      trackEvent("time_spent", { timeSpent }, true);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopHeartbeat();
      } else {
        startHeartbeat();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopHeartbeat();
    };
  }, []);

  const fetchLocationData = async () => {
    try {
      const locationDataFromLocalStorage = JSON.parse(
        localStorage.getItem("location")
      );
      if (locationDataFromLocalStorage) {
        locationData.current = locationDataFromLocalStorage;
        return;
      }
      const response = await fetch("/api/loc");
      if (response.ok) {
        locationData.current = await response.json();
        localStorage.setItem("location", JSON.stringify(locationData.current));
      } else {
        locationData.current = {
          city: "Unknown",
          region: "Unknown",
          country: "Unknown",
          countryCode: "XX",
        };
      }
    } catch (error) {
      console.error("Failed to fetch location data:", error);
      locationData.current = {
        city: "Unknown",
        region: "Unknown",
        country: "Unknown",
        countryCode: "XX",
      };
    }
  };

  const startHeartbeat = useCallback(() => {
    if (heartbeatInterval.current || isPreview) return;

    heartbeatInterval.current = setInterval(() => {
      if (!document.hidden && locationData.current) {
        const timeSpent = Math.round(
          (Date.now() - pageStartTime.current) / 1000
        );
        const scrollDepth = Math.round(
          (window.scrollY /
            (document.documentElement.scrollHeight - window.innerHeight)) *
            100
        );

        fetch("/api/portfolio/analytics/heartbeat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user:userId,
            sessionId: sessionId.current,
            page: window.location.pathname,
            timeSpent,
            scrollDepth: Math.max(scrollDepth, lastScrollDepth.current),
            ...locationData.current,
          }),
        }).catch((error) => {
          console.error("Heartbeat failed:", error);
        });
      }
    }, 30000);
  }, []);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }
  }, []);

  const trackEvent = useCallback(
    async (
      event: string,
      additionalData: Partial<AnalyticsEvent> = {},
      synchronous = false
    ) => {
      if (!locationData.current || isPreview) return;

      const eventData: AnalyticsEvent = {
        sessionId: sessionId.current,
        page: window.location.pathname,
        event,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        ...locationData.current,
        referrer: referrer.current,
        ...additionalData,
      };

      if (window.location.hash) {
        eventData.anchor = window.location.hash;
        eventData.user=userId
      }

      try {
        if (synchronous) {
          navigator.sendBeacon(
            "/api/portfolio/analytics",
            JSON.stringify(eventData)
          );
        } else {
          await fetch("/api/portfolio/analytics", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(eventData),
          });
        }
      } catch (error) {
        console.error("Failed to track analytics event:", error);
      }
    },
    []
  );

  const trackSectionView = useCallback(
    (section: string) => {
      trackEvent("section_view", { section });
    },
    [trackEvent]
  );

  const trackClick = useCallback(
    (target: string, section?: string) => {
      trackEvent("click", { clickTarget: target, section });
    },
    [trackEvent]
  );

  const trackProjectView = useCallback(
    (projectName: string) => {
      trackEvent("project_view", {
        clickTarget: projectName,
        section: "projects",
      });
    },
    [trackEvent]
  );

  const trackExternalLink = useCallback(
    (url: string, section?: string) => {
      trackEvent("external_link_click", { clickTarget: url, section });
    },
    [trackEvent]
  );

  const trackSocialLink = useCallback(
    (platform: string) => {
      trackEvent("social_link_click", {
        clickTarget: platform,
        section: "social",
      });
    },
    [trackEvent]
  );

  const trackContactForm = useCallback(() => {
    trackEvent("contact_form_submit", { section: "contact" });
  }, [trackEvent]);

  return {
    trackEvent,
    trackSectionView,
    trackClick,
    trackProjectView,
    trackExternalLink,
    trackSocialLink,
    trackContactForm,
  };
}

function throttle(func: any, limit: number) {
  let inThrottle: boolean;
  return function (this: any, ...args: any[]) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
