export type CandidateStatus = 
  | "new_application" 
  | "ai_screening" 
  | "interview" 
  | "hired" 
  | "rejected";

export interface Candidate {
  id: string;
  name: string;
  role: string;
  avatar: string;
  score: number;
  status: CandidateStatus;
  email: string;
  phone: string;
  appliedDate: string;
  resumeUrl: string | null;
  summary: string;
  strengths: string[];
  weaknesses: string[];
}

export const COLUMN_TITLES: Record<CandidateStatus, string> = {
  new_application: "New Application",
  ai_screening: "AI Screening",
  interview: "Interview",
  hired: "Hired",
  rejected: "Rejected",
};

export const COLUMN_ORDER: CandidateStatus[] = [
  "new_application",
  "ai_screening",
  "interview",
  "hired",
  "rejected",
];
