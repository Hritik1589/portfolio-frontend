import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AchievementResponse, ApiResponse } from '../models/achievement.model';

@Injectable({
  providedIn: 'root'
})
export class PublicAchievementService {
  private readonly http = inject(HttpClient);
  // Pointing to your public controller endpoint
  private readonly publicApiUrl = `${environment.apiUrl}/public/achievements`;

  getAllAchievements(): Observable<ApiResponse<AchievementResponse[]>> {
    return this.http.get<ApiResponse<AchievementResponse[]>>(this.publicApiUrl);
  }
}