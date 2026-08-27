import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicExperienceService } from '../../../core/services/public-experience.service';
import { ExperienceResponse } from '../../../core/models/experience.model';

@Component({
  selector: 'app-public-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-experience.component.html',
  styleUrl: './public-experience.component.scss'
})
export class PublicExperienceComponent implements OnInit {
  private readonly experienceService = inject(PublicExperienceService);

  public experiences = signal<ExperienceResponse[]>([]);
  public isLoading = signal<boolean>(true);
  public errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchExperiences();
  }

  private fetchExperiences(): void {
    this.isLoading.set(true);
    this.experienceService.getAllExperiences().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          // 🚨 FIX: Safely map Spring Boot's Jackson boolean serialization (isCurrent/current)
          const mappedData = res.data.map((exp: any) => ({
            ...exp,
            isCurrent: exp.isCurrent !== undefined ? exp.isCurrent : exp.current || false
          }));

          // Sort descending by startDate (newest first)
          const sorted = mappedData.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
          this.experiences.set(sorted);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load public experience data', err);
        this.errorMessage.set('Unable to load career history at this time.');
        this.isLoading.set(false);
      }
    });
  }
}