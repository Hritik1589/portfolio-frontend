export interface ApiResponse<T> {
  readonly success: boolean;
  readonly message: string;
  readonly data: T;
  readonly errorDetails?: string | null;
}

export interface LoginRequest {
  readonly username: string; // Backend accepts email or mobile here
  readonly password: string;
}

export interface JwtResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly roles: string[];
}

export interface RegisterRequest {
  readonly name: string;
  readonly email: string;
  readonly mobile?: string; // Optional depending on your backend
  readonly password: string;
}

export interface OtpRequest {
  readonly target: string;      // Changed from 'email'
  readonly otp: string;         // Changed from 'otpCode'
  readonly targetType: string;
}

export interface TargetRequest {
  readonly target: string;
}

export interface ResetPasswordRequest {
  readonly target: string;
  readonly otp: string;
  readonly newPassword: string;
}