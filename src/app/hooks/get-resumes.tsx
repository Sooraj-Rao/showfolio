"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useZustandStore } from "@/zustand/store";

const useResumes = () => {
  const { resumes, setResumes } = useZustandStore();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchResumes = useCallback(async () => {
    try {
      const response = await axios.get("/api/resume/?operation=getall");
      const { data } = response;

      if (response.status !== 200) {
        throw new Error("Failed to fetch resumes");
      }

      setResumes(data);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          window.location.href = "/auth/login";
        } else {
          setError(err.response?.data?.error || "Error fetching resumes");
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, [setResumes]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  return {
    resumes,
    fetchError: error,
    loadingResumes: isLoading,
    fetchResumes,
  };
};

export default useResumes;
