import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ProjectRequest, ProjectResponse,Page } from '../models/project.model';
import { ApiResponse } from '../models/auth.model'; // Adjust path to where your ApiResponse is

@Injectable({ providedIn: 'root' })
export class AdminProjectService {
  private readonly http = inject(HttpClient);
  
  // Admin Endpoints for CRUD
  private readonly ADMIN_API = `${environment.apiUrl}/admin/projects`;
  // Public Endpoint for fetching list
  private readonly PUBLIC_API = `${environment.apiUrl}/public/projects`; 

 getAllProjects(): Observable<ApiResponse<Page<ProjectResponse>>> {
    return this.http.get<ApiResponse<Page<ProjectResponse>>>(this.PUBLIC_API);
  }

  getProjectById(id: number): Observable<ApiResponse<ProjectResponse>> {
    return this.http.get<ApiResponse<ProjectResponse>>(`${this.ADMIN_API}/${id}`);
  }

  createProject(request: ProjectRequest): Observable<ApiResponse<ProjectResponse>> {
    return this.http.post<ApiResponse<ProjectResponse>>(this.ADMIN_API, request);
  }

  updateProject(id: number, request: ProjectRequest): Observable<ApiResponse<ProjectResponse>> {
    return this.http.put<ApiResponse<ProjectResponse>>(`${this.ADMIN_API}/${id}`, request);
  }

  deleteProject(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.ADMIN_API}/${id}`);
  }
  
}