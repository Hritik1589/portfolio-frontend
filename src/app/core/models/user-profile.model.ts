export interface UserProfileResponse {
  id: number;
  name: string;
  email: string;
  mobile?: string;
  roles: string[];
  isEmailVerified: boolean;
}

export interface UserProfileUpdateRequest {
  name: string;
  mobile?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}