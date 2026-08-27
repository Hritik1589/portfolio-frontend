import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, LoginRequest, JwtResponse, RegisterRequest,OtpRequest,TargetRequest,ResetPasswordRequest} from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/auth`;

  login(request: LoginRequest): Observable<ApiResponse<JwtResponse>> {
    return this.http.post<ApiResponse<JwtResponse>>(`${this.API_URL}/login`, request).pipe(
      tap(response => {
        if (response.success && response.data) {
          // Store tokens temporarily in localStorage for this test phase
          localStorage.setItem('access_token', response.data.accessToken);
          localStorage.setItem('refresh_token', response.data.refreshToken);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }
  register(request: RegisterRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(`${this.API_URL}/register`, request);
  }
  verifyOtp(request: OtpRequest): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.API_URL}/verify-otp`, request).pipe(
      tap(response => {
        if (response.success) {
          // Mark user as active in local storage or update the stored JWT
          localStorage.setItem('user_active', 'true');
          if (response.data?.accessToken) {
            localStorage.setItem('access_token', response.data.accessToken);
          }
        }
      })
    );
  }
  forgotPassword(request: TargetRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.API_URL}/forgot-password`, request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(`${this.API_URL}/reset-password`, request);
  }
}