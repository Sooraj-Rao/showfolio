"use client";

import { useEffect, useRef } from "react";
import { usePortfolioAnalyticsEnhanced } from "./use-portfolio-analytics";

export function useSectionObserver() {
  const { trackSectionView } = usePortfolioAnalyticsEnhanced();
  const observedSections = useRef<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const sectionId = entry.target.id;

            if (sectionId && !observedSections.current.has(sectionId)) {
              observedSections.current.add(sectionId);
              trackSectionView(sectionId);
            }
          }
        });
      },
      {
        threshold: 0.5, 
        rootMargin: "-50px 0px", 
      }
    );

    const sections = document.querySelectorAll("[id]");
    sections.forEach((section) => {
      if (section.id) {
        observer.observe(section);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [trackSectionView]);

  return { observedSections: observedSections.current };
}
