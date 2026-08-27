import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminAchievementService } from '../../../core/services/admin-achievement.service';
import { AchievementResponse, AchievementRequest } from '../../../core/models/achievement.model';

@Component({
  selector: 'app-admin-achievements',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-achievements.component.html',
  styleUrl: './admin-achievements.component.scss'
})
export class AdminAchievementsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly achievementService = inject(AdminAchievementService);

  public achievements = signal<AchievementResponse[]>([]);
  public isLoading = signal<boolean>(true);
  public isSubmitting = signal<boolean>(false);
  
  public isModalOpen = signal<boolean>(false);
  public editingId = signal<number | null>(null);
  public formError = signal<string>('');

  public achievementForm: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    organization: ['', Validators.required],
    description: ['', [Validators.required, Validators.minLength(10)]],
    date: ['', Validators.required],
    certUrl: [''],
    imageUrl: ['']
  });

  ngOnInit(): void {
    this.loadAchievements();
  }
  isEditMode(): boolean {
  return this.editingId() !== null;
}
  loadAchievements(): void {
    this.isLoading.set(true);
    this.achievementService.getAllAchievements().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.achievements.set(res.data);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load achievements', err);
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.editingId.set(null);
    this.achievementForm.reset();
    this.formError.set('');
    this.isModalOpen.set(true);
  }

  openEditModal(id: number): void {
    this.editingId.set(id);
    this.formError.set('');
    this.isModalOpen.set(true);
    
    this.achievementService.getAchievementById(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.achievementForm.patchValue({
            title: res.data.title,
            organization: res.data.organization,
            description: res.data.description,
            date: res.data.date,
            certUrl: res.data.certUrl || '',
            imageUrl: res.data.imageUrl || ''
          });
        }
      },
      error: () => {
        this.formError.set('Failed to load achievement details.');
      }
    });
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    setTimeout(() => {
      this.achievementForm.reset();
      this.editingId.set(null);
    }, 300); // Wait for modal exit animation
  }

  onSubmit(): void {
    if (this.achievementForm.invalid) {
      this.achievementForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.formError.set('');
    
    const payload: AchievementRequest = this.achievementForm.value;
    const currentEditId = this.editingId();

    const request$ = currentEditId 
      ? this.achievementService.updateAchievement(currentEditId, payload)
      : this.achievementService.createAchievement(payload);

    request$.subscribe({
      next: (res) => {
        if (res.success) {
          this.loadAchievements();
          this.closeModal();
        } else {
          this.formError.set(res.message || 'Operation failed.');
        }
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.formError.set(err?.error?.message || 'An error occurred.');
        this.isSubmitting.set(false);
      }
    });
  }

  deleteAchievement(id: number): void {
    if (confirm('Are you sure you want to delete this achievement? This cannot be undone.')) {
      this.achievementService.deleteAchievement(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.loadAchievements();
          }
        },
        error: () => {
          alert('Failed to delete achievement.');
        }
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.achievementForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }
}