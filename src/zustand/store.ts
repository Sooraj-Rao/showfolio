import { IResume } from "@/models/resume";
import { create } from "zustand";

export interface IAuthUser {
  private: {
    portfolio?: boolean;
    profile?: boolean;
    resumes?: boolean;
  };
  name: string;
  email: string;
  portfolio?: string;
  resumes?: IResume[];
  createdAt: Date;
  isActive: boolean;
  templateId: string;
  hasPorfolioData?: boolean;
}

type ZustandStore = {
  userData: IAuthUser | null;
  setUserData: (userData: IAuthUser) => void;
  resumes: IResume[] | [];
  setResumes: (resumes: IResume[]) => void;
};

export const useZustandStore = create<ZustandStore>((set) => ({
  userData: null,
  setUserData: (userData) => set({ userData }),
  resumes: [],
  setResumes: (resumes) => set({ resumes }),
}));
