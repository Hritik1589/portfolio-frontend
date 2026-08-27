// src/app/core/services/public-contact.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactMessageRequest } from '../models/contact-message.model';
import{ApiResponse} from '../models/auth.model'; // Assuming generic ApiResponse<T> is here
@Injectable({
  providedIn: 'root'
})
export class PublicContactService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/public/contact';

  sendMessage(request: ContactMessageRequest): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(this.apiUrl, request);
  }
}