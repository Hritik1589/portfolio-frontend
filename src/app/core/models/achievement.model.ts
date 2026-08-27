export interface AchievementResponse {
  id: number;
  title: string;
  description: string;
  date: string; // ISO format YYYY-MM-DD
  organization: string;
  certUrl?: string | null;
  imageUrl?: string | null;
}

export interface AchievementRequest {
  title: string;
  description: string;
  date: string;
  organization: string;
  certUrl?: string | null;
  imageUrl?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}