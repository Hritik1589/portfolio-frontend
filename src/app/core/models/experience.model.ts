export interface ExperienceResponse {
  id: number;
  company: string;
  role: string;
  startDate: string; // YYYY-MM-DD format
  endDate?: string | null;
  isCurrent: boolean;
  description: string;
  achievements?: string | null;
}

export interface ExperienceRequest {
  company: string;
  role: string;
  startDate: string;
  endDate?: string | null;
  isCurrent: boolean;
  description: string;
  achievements?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}