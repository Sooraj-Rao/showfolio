"use client";

import { useState, useCallback } from "react";
import axios from "axios";

interface ResumeData {
  [key: string]: string;
}

interface UseGetResumeDataProps {
  shortUrl: string;
  operation: string;
}

const useGetResumeData = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  const fetchResumeData = useCallback(
    async ({ shortUrl, operation }: UseGetResumeDataProps) => {
      if (!shortUrl) {
        setError("Short URL is required.");
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        let response;
        if (operation === "ResumePreview") {
          response = await axios.get(
            `/api/resume/resume-preview?shortUrl=${shortUrl}`
          );
        } else {
          response = await axios.get(
            `/api/resume/?shortUrl=${shortUrl}&operation=${operation}`
          );
        }

        if (response.status === 200) {
          setResumeData(response.data);
        } else {
          throw new Error("Unexpected response status");
        }
      } catch (err) {
        handleError(err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const handleError = (err: unknown) => {
    if (axios.isAxiosError(err)) {
      if (err.response) {
        const statusCode = err.response.status;
        switch (statusCode) {
          case 404:
            setError("Resume not found.");
            break;
          case 500:
            setError("Server error. Please try again later.");
            break;
          default:
            setError(
              err.response.data?.error || "An unexpected error occurred."
            );
        }
      } else if (err.request) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError("An unexpected error occurred.");
      }
    } else {
      setError("An unexpected error occurred.");
    }
  };

  return { resumeData, fetchResumeData, isLoading, error };
};

export default useGetResumeData;
