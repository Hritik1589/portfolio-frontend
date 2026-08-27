import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SkillResponse, ApiResponse } from '../models/skill.model';

@Injectable({
  providedIn: 'root'
})
export class PublicSkillService {
  private readonly http = inject(HttpClient);
  private readonly publicApiUrl = `${environment.apiUrl}/public/skills`;

  getAllSkills(): Observable<ApiResponse<SkillResponse[]>> {
    return this.http.get<ApiResponse<SkillResponse[]>>(this.publicApiUrl);
  }

  getSkillsByCategory(category: string): Observable<ApiResponse<SkillResponse[]>> {
    return this.http.get<ApiResponse<SkillResponse[]>>(`${this.publicApiUrl}/category/${category}`);
  }
}