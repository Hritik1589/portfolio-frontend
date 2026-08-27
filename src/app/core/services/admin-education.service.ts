import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EducationRequest, EducationResponse, ApiResponse } from '../models/education.model';

@Injectable({
  providedIn: 'root'
})
export class AdminEducationService {
  private readonly http = inject(HttpClient);
  private readonly adminApiUrl = `${environment.apiUrl}/admin/education`;

  getAllEducation(): Observable<ApiResponse<EducationResponse[]>> {
    return this.http.get<ApiResponse<EducationResponse[]>>(this.adminApiUrl);
  }

  getEducationById(id: number): Observable<ApiResponse<EducationResponse>> {
    return this.http.get<ApiResponse<EducationResponse>>(`${this.adminApiUrl}/${id}`);
  }

  createEducation(data: EducationRequest): Observable<ApiResponse<EducationResponse>> {
    return this.http.post<ApiResponse<EducationResponse>>(this.adminApiUrl, data);
  }

  updateEducation(id: number, data: EducationRequest): Observable<ApiResponse<EducationResponse>> {
    return this.http.put<ApiResponse<EducationResponse>>(`${this.adminApiUrl}/${id}`, data);
  }

  deleteEducation(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.adminApiUrl}/${id}`);
  }
}