import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ExperienceResponse, ApiResponse } from '../models/experience.model';

@Injectable({
  providedIn: 'root'
})
export class PublicExperienceService {
  private readonly http = inject(HttpClient);
  // Pointing to your public controller endpoint
  private readonly publicApiUrl = `${environment.apiUrl}/public/experiences`;

  getAllExperiences(): Observable<ApiResponse<ExperienceResponse[]>> {
    return this.http.get<ApiResponse<ExperienceResponse[]>>(this.publicApiUrl);
  }
}