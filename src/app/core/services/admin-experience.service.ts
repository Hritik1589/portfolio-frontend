import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ExperienceRequest, ExperienceResponse, ApiResponse } from '../models/experience.model';

@Injectable({
  providedIn: 'root'
})
export class AdminExperienceService {
  private readonly http = inject(HttpClient);
  private readonly adminApiUrl = `${environment.apiUrl}/admin/experiences`;

  getAllExperiences(): Observable<ApiResponse<ExperienceResponse[]>> {
    return this.http.get<ApiResponse<ExperienceResponse[]>>(this.adminApiUrl);
  }

  getExperienceById(id: number): Observable<ApiResponse<ExperienceResponse>> {
    return this.http.get<ApiResponse<ExperienceResponse>>(`${this.adminApiUrl}/${id}`);
  }

  createExperience(data: ExperienceRequest): Observable<ApiResponse<ExperienceResponse>> {
    return this.http.post<ApiResponse<ExperienceResponse>>(this.adminApiUrl, data);
  }

  updateExperience(id: number, data: ExperienceRequest): Observable<ApiResponse<ExperienceResponse>> {
    return this.http.put<ApiResponse<ExperienceResponse>>(`${this.adminApiUrl}/${id}`, data);
  }

  deleteExperience(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.adminApiUrl}/${id}`);
  }
}