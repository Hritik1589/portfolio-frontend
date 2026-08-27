// src/app/core/services/admin-contact.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactMessageResponse, Page } from '../models/contact-message.model';
import { ApiResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AdminContactService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/v1/admin/messages';

  getAllMessages(search?: string, page = 0, size = 10): Observable<ApiResponse<Page<ContactMessageResponse>> | Page<ContactMessageResponse>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (search && search.trim() !== '') {
      params = params.set('search', search);
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  getUnreadMessages(page = 0, size = 10): Observable<ApiResponse<Page<ContactMessageResponse>> | Page<ContactMessageResponse>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<any>(`${this.apiUrl}/unread`, { params });
  }

  getUnreadCount(): Observable<ApiResponse<number> | number> {
    return this.http.get<any>(`${this.apiUrl}/unread/count`);
  }

  getMessageById(id: number): Observable<ApiResponse<ContactMessageResponse>> {
    return this.http.get<ApiResponse<ContactMessageResponse>>(`${this.apiUrl}/${id}`);
  }

  markAsRead(id: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/read`, {});
  }

  deleteMessage(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}