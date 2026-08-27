import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProjectResponse, Page, ApiResponse } from '../models/project.model';

@Injectable({ providedIn: 'root' })
export class PublicProjectService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/public/projects`;

  getFeaturedProjects(): Observable<ApiResponse<ProjectResponse[]>> {
    return this.http.get<ApiResponse<ProjectResponse[]>>(`${this.API_URL}/featured`);
  }

  getAllProjects(page: number = 0, size: number = 9, search: string = ''): Observable<ApiResponse<Page<ProjectResponse>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
      
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<ApiResponse<Page<ProjectResponse>>>(this.API_URL, { params });
  }

  getProjectBySlug(slug: string): Observable<ApiResponse<ProjectResponse>> {
    return this.http.get<ApiResponse<ProjectResponse>>(`${this.API_URL}/${slug}`);
  }
}