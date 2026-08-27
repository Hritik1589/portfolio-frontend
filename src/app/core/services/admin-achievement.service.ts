import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AchievementRequest, AchievementResponse, ApiResponse } from '../models/achievement.model';

@Injectable({
  providedIn: 'root'
})
export class AdminAchievementService {
  private readonly http = inject(HttpClient);
  
  // Using the exact correct path relative to your environment configuration
  private readonly adminApiUrl = `${environment.apiUrl}/admin/achievements`;
  
  getAllAchievements(): Observable<ApiResponse<AchievementResponse[]>> {
    return this.http.get<ApiResponse<AchievementResponse[]>>(this.adminApiUrl);
  }

  getAchievementById(id: number): Observable<ApiResponse<AchievementResponse>> {
    return this.http.get<ApiResponse<AchievementResponse>>(`${this.adminApiUrl}/${id}`);
  }

  createAchievement(data: AchievementRequest): Observable<ApiResponse<AchievementResponse>> {
    return this.http.post<ApiResponse<AchievementResponse>>(this.adminApiUrl, data);
  }

  updateAchievement(id: number, data: AchievementRequest): Observable<ApiResponse<AchievementResponse>> {
    return this.http.put<ApiResponse<AchievementResponse>>(`${this.adminApiUrl}/${id}`, data);
  }

  deleteAchievement(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.adminApiUrl}/${id}`);
  }
}