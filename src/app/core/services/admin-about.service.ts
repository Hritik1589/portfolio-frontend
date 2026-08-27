// src/app/core/services/admin-about.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AboutResponse, AboutRequest} from '../models/about.model';
import { ApiResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AdminAboutService {
  private readonly http = inject(HttpClient);
  
  // Endpoints matching backend controllers
  private readonly publicApiUrl = 'http://localhost:8080/api/v1/public/about';
  private readonly adminApiUrl = 'http://localhost:8080/api/v1/admin/about';

  getAbout(): Observable<ApiResponse<AboutResponse>> {
    return this.http.get<ApiResponse<AboutResponse>>(this.publicApiUrl);
  }

  updateAbout(data: AboutRequest): Observable<ApiResponse<AboutResponse>> {
    return this.http.put<ApiResponse<AboutResponse>>(this.adminApiUrl, data);
  }
}