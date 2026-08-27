import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SkillRequest, SkillResponse, ApiResponse } from '../models/skill.model';

@Injectable({
  providedIn: 'root'
})
export class AdminSkillService {
  private readonly http = inject(HttpClient);
  private readonly adminApiUrl = `${environment.apiUrl}/admin/skills`;

  getAllSkills(): Observable<ApiResponse<SkillResponse[]>> {
    return this.http.get<ApiResponse<SkillResponse[]>>(this.adminApiUrl);
  }

  getSkillById(id: number): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(`${this.adminApiUrl}/${id}`);
  }

  createSkill(data: SkillRequest): Observable<ApiResponse<SkillResponse>> {
    return this.http.post<ApiResponse<SkillResponse>>(this.adminApiUrl, data);
  }

  updateSkill(id: number, data: SkillRequest): Observable<ApiResponse<SkillResponse>> {
    return this.http.put<ApiResponse<SkillResponse>>(`${this.adminApiUrl}/${id}`, data);
  }

  deleteSkill(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.adminApiUrl}/${id}`);
  }
}