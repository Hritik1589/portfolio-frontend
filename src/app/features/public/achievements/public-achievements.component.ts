import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicAchievementService } from '../../../core/services/public-achievement.service';
import { AchievementResponse } from '../../../core/models/achievement.model';

@Component({
  selector: 'app-public-achievements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-achievements.component.html',
  styleUrl: './public-achievements.component.scss'
})
export class PublicAchievementsComponent implements OnInit {
  private readonly achievementService = inject(PublicAchievementService);

  public achievements = signal<AchievementResponse[]>([]);
  public isLoading = signal<boolean>(true);
  public errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchAchievements();
  }

  private fetchAchievements(): void {
    this.isLoading.set(true);
    this.achievementService.getAllAchievements().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          // Sort by date descending (newest first) just in case the backend doesn't
          const sorted = res.data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          this.achievements.set(sorted);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load public achievements', err);
        this.errorMessage.set('Unable to load milestones at this time.');
        this.isLoading.set(false);
      }
    });
  }
}