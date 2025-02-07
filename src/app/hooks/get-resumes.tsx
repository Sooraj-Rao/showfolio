"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { useZustandStore } from "@/zustand/store";

const useResumes = () => {
  const { resumes, setResumes } = useZustandStore();
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchResumes = async () => {
    try {
      const response = await axios.get("/api/resume/?operation=getall");
      const { data } = response;

      if (response.status !== 200) {
        throw new Error("Failed to fetch resumes");
      }

      setResumes(data);
    } catch (err) {
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
  };
  useEffect(() => {
    fetchResumes();
  }, []);

  return {
    resumes,
    fetchError: error,
    loadingResumes: isLoading,
    fetchResumes,
  };
};

export default useResumes;
