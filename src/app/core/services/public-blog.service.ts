// src/app/core/services/public-blog.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BlogResponse, Page, ApiResponse } from '../models/blog.model';

@Injectable({ providedIn: 'root' })
export class PublicBlogService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/public/blogs`;

  getPublishedBlogs(search = '', category = '', page = 0, size = 9): Observable<ApiResponse<Page<BlogResponse>>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) {
      params = params.set('search', search);
    }
    if (category) {
      params = params.set('category', category);
    }

    return this.http.get<ApiResponse<Page<BlogResponse>>>(this.API_URL, { params });
  }

  getBlogBySlug(slug: string): Observable<ApiResponse<BlogResponse>> {
    return this.http.get<ApiResponse<BlogResponse>>(`${this.API_URL}/${slug}`);
  }
}