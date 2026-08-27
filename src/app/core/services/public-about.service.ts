// src/app/core/services/public-about.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AboutResponse } from '../models/about.model';
import { ApiResponse } from '../models/auth.model'; // Assuming generic ApiResponse<T> is here

@Injectable({
  providedIn: 'root'
})
export class PublicAboutService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/public/about';

  getAbout(): Observable<ApiResponse<AboutResponse>> {
    return this.http.get<ApiResponse<AboutResponse>>(this.apiUrl);
  }
}