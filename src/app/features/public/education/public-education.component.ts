import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicEducationService } from '../../../core/services/public-education.service';
import { EducationResponse } from '../../../core/models/education.model';

@Component({
  selector: 'app-public-education',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-education.component.html',
  styleUrl: './public-education.component.scss'
})
export class PublicEducationComponent implements OnInit {
  private readonly educationService = inject(PublicEducationService);

  public educationList = signal<EducationResponse[]>([]);
  public isLoading = signal<boolean>(true);
  public errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.fetchEducation();
  }

  private fetchEducation(): void {
    this.isLoading.set(true);
    this.educationService.getAllEducation().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          // Sort descending by startYear (newest first)
          const sorted = res.data.sort((a, b) => b.startYear - a.startYear);
          this.educationList.set(sorted);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load public education data', err);
        this.errorMessage.set('Unable to load academic history at this time.');
        this.isLoading.set(false);
      }
    });
  }
}