"use client";
import { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useZustandStore } from "@/zustand/store";

const useGetUserData = () => {
  const { userData, setUserData, setResumes } = useZustandStore();
  const [error, setError] = useState<string>("");
  const [loadingUserData, setloadingUserData] = useState(false);

  const fetchUserData = async (): Promise<void> => {
    try {
      setloadingUserData(true);
      const response = await axios.get("/api/user");
      const { data } = response;

      if (response.status !== 200) {
        throw new Error("Failed to fetch resumes");
      }

      setUserData(data);
      setResumes(data?.resumes);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError;
        if (axiosErr.response?.status === 401) {
          window.location.href = "/auth/login";
        } else {
          const errorMessage =
            (axiosErr.response?.data as { error?: string })?.error ||
            "Error fetching resumes";
          setError(errorMessage);
        }
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setloadingUserData(false);
    }
  };
  useEffect(() => {
    if (!userData) fetchUserData();
  }, []);
  return { fetchUserData, userData, error, loadingUserData, setUserData };
};

export default useGetUserData;
