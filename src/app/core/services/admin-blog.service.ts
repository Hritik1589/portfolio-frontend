// src/app/core/services/admin-blog.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BlogRequest, BlogResponse, Page, ApiResponse } from '../models/blog.model';

@Injectable({ providedIn: 'root' })
export class AdminBlogService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/admin/blogs`;

  getAllBlogs(search = '', page = 0, size = 10): Observable<ApiResponse<Page<BlogResponse>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
      
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<ApiResponse<Page<BlogResponse>>>(this.API_URL, { params });
  }

  getBlogById(id: number): Observable<ApiResponse<BlogResponse>> {
    return this.http.get<ApiResponse<BlogResponse>>(`${this.API_URL}/${id}`);
  }

  createBlog(blog: BlogRequest): Observable<ApiResponse<BlogResponse>> {
    return this.http.post<ApiResponse<BlogResponse>>(this.API_URL, blog);
  }

  updateBlog(id: number, blog: BlogRequest): Observable<ApiResponse<BlogResponse>> {
    return this.http.put<ApiResponse<BlogResponse>>(`${this.API_URL}/${id}`, blog);
  }

  deleteBlog(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`);
  }

  // Change both of these in admin-blog.service.ts:

  publishBlog(id: number): Observable<ApiResponse<void>> {
    // 🚨 FIX: Change {} to null
    return this.http.patch<ApiResponse<void>>(`${this.API_URL}/${id}/publish`, null);
  }

  unpublishBlog(id: number): Observable<ApiResponse<void>> {
    // 🚨 FIX: Change {} to null
    return this.http.patch<ApiResponse<void>>(`${this.API_URL}/${id}/unpublish`, null);
  }
}