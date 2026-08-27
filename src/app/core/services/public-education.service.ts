import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { EducationResponse, ApiResponse } from '../models/education.model';

@Injectable({
  providedIn: 'root'
})
export class PublicEducationService {
  private readonly http = inject(HttpClient);
  // Pointing to your public controller endpoint
  private readonly publicApiUrl = `${environment.apiUrl}/public/education`;

  getAllEducation(): Observable<ApiResponse<EducationResponse[]>> {
    return this.http.get<ApiResponse<EducationResponse[]>>(this.publicApiUrl);
  }
}