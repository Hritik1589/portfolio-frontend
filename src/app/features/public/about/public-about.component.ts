// src/app/features/public/public-about/public-about.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicAboutService } from '../../../core/services/public-about.service';
import { AboutResponse } from '../../../core/models/about.model';

@Component({
  selector: 'app-public-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-about.component.html',
  styleUrl: './public-about.component.scss'
})
export class PublicAboutComponent implements OnInit {
    
  private readonly aboutService = inject(PublicAboutService);

  public aboutData = signal<AboutResponse | null>(null);
  public isLoading = signal<boolean>(true);
  public errorMessage = signal<string | null>(null);
  

  // Frontend-only clickable social links (not stored in backend)
  public readonly githubUrl = 'https://www.google.com/';
  public readonly linkedinUrl = 'https://www.google.com/';

  ngOnInit(): void {
    this.fetchAboutData();
  }

  private fetchAboutData(): void {
    this.isLoading.set(true);
    this.aboutService.getAbout().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.aboutData.set(res.data);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load public about data', err);
        this.errorMessage.set('Unable to load profile data. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }
}