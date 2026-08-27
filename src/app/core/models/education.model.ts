export interface EducationResponse {
  id: number;
  degree: string;
  university: string;
  startYear: number;
  endYear?: number | null;
  gpaOrPercentage?: string | null;
  description?: string | null;
}

export interface EducationRequest {
  degree: string;
  university: string;
  startYear: number;
  endYear?: number | null;
  gpaOrPercentage?: string | null;
  description?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}