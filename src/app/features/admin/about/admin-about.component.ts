// src/app/features/admin/admin-about/admin-about.component.ts
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminAboutService } from '../../../core/services/admin-about.service';
import { AboutRequest } from '../../../core/models/about.model';

@Component({
  selector: 'app-admin-about',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-about.component.html',
  styleUrl: './admin-about.component.scss'
})
export class AdminAboutComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly aboutService = inject(AdminAboutService);

  public aboutForm!: FormGroup;
  public isLoading = signal<boolean>(true);
  public isSaving = signal<boolean>(false);
  public successMessage = signal<string | null>(null);
  public errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.initForm();
    this.fetchAboutData();
  }

  private initForm(): void {
    this.aboutForm = this.fb.group({
      summary: ['', [Validators.required]],
      careerJourney: [''],
      currentFocus: [''],
      goals: ['']
    });
  }

  private fetchAboutData(): void {
    this.isLoading.set(true);
    this.aboutService.getAbout().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.aboutForm.patchValue(res.data);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load about data', err);
        this.errorMessage.set('Failed to load profile details.');
        this.isLoading.set(false);
      }
    });
  }

  public onSubmit(): void {
    if (this.aboutForm.invalid) {
      this.aboutForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const payload: AboutRequest = this.aboutForm.value;

    this.aboutService.updateAbout(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage.set('About information updated successfully!');
        } else {
          this.errorMessage.set(res.message || 'Failed to update profile.');
        }
        this.isSaving.set(false);
        setTimeout(() => this.successMessage.set(null), 4000);
      },
      error: (err) => {
        console.error('Error updating profile', err);
        this.errorMessage.set('An unexpected error occurred while saving.');
        this.isSaving.set(false);
      }
    });
  }
}