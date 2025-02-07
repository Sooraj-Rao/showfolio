import { IResume } from "@/models/resume";

export async function fetchResumes(): Promise<IResume[]> {
  const response = await fetch("/api/resumes");
  if (!response.ok) {
    throw new Error("Failed to fetch resumes");
  }
  return response.json();
}


export async function fetchResumeData() {
  try {
    const response = await fetch('/api/resume');
    if (!response.ok) {
      throw new Error('Failed to fetch resume data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching resume data:', error);
    throw error;
  }
}

