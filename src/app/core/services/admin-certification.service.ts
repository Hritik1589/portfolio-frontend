import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { 
  CertificationRequest, 
  CertificationResponse, 
  ApiResponse 
} from '../models/certification.model';

@Injectable({
  providedIn: 'root'
})
export class AdminCertificationService {
  private readonly http = inject(HttpClient);
  // Assume a standard endpoint structure based on your setup
  private readonly adminApiUrl = `${environment.apiUrl}/admin/certifications`;
  
  // Assuming a public or admin list endpoint exists at the root path
 getAllCertifications(): Observable<ApiResponse<CertificationResponse[]>> {
    return this.http.get<ApiResponse<CertificationResponse[]>>(`${environment.apiUrl}/public/certifications`); 
    // ^ Update this URL to wherever your backend actually serves the list!
  }

  getCertificationById(id: number): Observable<ApiResponse<CertificationResponse>> {
    return this.http.get<ApiResponse<CertificationResponse>>(`${this.adminApiUrl}/${id}`);
  }

  createCertification(data: CertificationRequest): Observable<ApiResponse<CertificationResponse>> {
    return this.http.post<ApiResponse<CertificationResponse>>(this.adminApiUrl, data);
  }

  updateCertification(id: number, data: CertificationRequest): Observable<ApiResponse<CertificationResponse>> {
    return this.http.put<ApiResponse<CertificationResponse>>(`${this.adminApiUrl}/${id}`, data);
  }

  deleteCertification(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.adminApiUrl}/${id}`);
  }
}