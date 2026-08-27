import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CertificationResponse, ApiResponse } from '../models/certification.model';

@Injectable({
  providedIn: 'root'
})
export class PublicCertificationService {
  private readonly http = inject(HttpClient);
  // Assuming environment.apiUrl is "http://localhost:8080/api/v1"
  private readonly publicApiUrl = `${environment.apiUrl}/public/certifications`;

  getAllCertifications(): Observable<ApiResponse<CertificationResponse[]>> {
    return this.http.get<ApiResponse<CertificationResponse[]>>(this.publicApiUrl);
  }
}