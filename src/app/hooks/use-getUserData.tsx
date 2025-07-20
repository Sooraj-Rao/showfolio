"use client";
import { useState, useEffect, useCallback } from "react";
import axios, { AxiosError } from "axios";
import { useZustandStore } from "@/zustand/store";
import { usePathname } from "next/navigation";

const useGetUserData = () => {
  const { userData, setUserData, setResumes } = useZustandStore();
  const [error, setError] = useState<string>("");
  const path = usePathname();
  const [loadingUserData, setLoadingUserData] = useState(false);

  const fetchUserData = useCallback(async (): Promise<void> => {
    try {
      setLoadingUserData(true);
      const response = await axios.get("/api/user");
      const { data } = response;

      if (response.status !== 200) {
        throw new Error("Failed to fetch user data");
      }

      setUserData(data);
      setResumes(data?.resumes);
    } catch (err: unknown) {
      if (path === "/" || path === "/home") return;
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError;
        if (axiosErr.response?.status === 401) {
          window.location.href = "/auth/login";
        } else {
          const errorMessage =
            (axiosErr.response?.data as { error?: string })?.error ||
            "Error fetching user data";
          setError(errorMessage);
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoadingUserData(false);
    }
  }, [setUserData, setResumes]);

  useEffect(() => {
    if (!userData) {
      fetchUserData();
    }
  }, [fetchUserData, userData]);

  return { fetchUserData, userData, error, loadingUserData, setUserData };
};

export default useGetUserData;
