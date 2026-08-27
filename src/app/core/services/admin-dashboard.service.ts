import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../models/auth.model'; // Assuming generic ApiResponse<T> is here

@Injectable({ providedIn: 'root' })
export class AdminDashboardService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/admin`;

  // Assuming an HttpInterceptor is automatically attaching the "Bearer <JWT>"
  getUnreadMessageCount(): Observable<ApiResponse<number>> {
    return this.http.get<ApiResponse<number>>(`${this.API_URL}/messages/unread/count`);
  }
  getVisitorCount(): Observable<ApiResponse<number> | number> {
    return this.http.get<any>(`${this.API_URL}/visitors/count`);
  }
}