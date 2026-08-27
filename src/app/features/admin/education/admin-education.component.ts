import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminEducationService } from '../../../core/services/admin-education.service';
import { EducationResponse, EducationRequest } from '../../../core/models/education.model';

@Component({
  selector: 'app-admin-education',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-education.component.html',
  styleUrl: './admin-education.component.scss'
})
export class AdminEducationComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly educationService = inject(AdminEducationService);

  public educationList = signal<EducationResponse[]>([]);
  public isLoading = signal<boolean>(true);
  public isSubmitting = signal<boolean>(false);
  
  public isModalOpen = signal<boolean>(false);
  public editingId = signal<number | null>(null);
  public formError = signal<string>('');

  public educationForm: FormGroup = this.fb.group({
    degree: ['', [Validators.required]],
    university: ['', [Validators.required]],
    startYear: [null, [Validators.required, Validators.min(1900), Validators.max(2100)]],
    endYear: [null],
    gpaOrPercentage: [''],
    description: ['']
  });

  ngOnInit(): void {
    this.loadEducation();
  }

  loadEducation(): void {
    this.isLoading.set(true);
    this.educationService.getAllEducation().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          // Sort by start year descending
          const sorted = res.data.sort((a, b) => b.startYear - a.startYear);
          this.educationList.set(sorted);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load education', err);
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.editingId.set(null);
    this.educationForm.reset();
    this.formError.set('');
    this.isModalOpen.set(true);
  }

  openEditModal(id: number): void {
    this.editingId.set(id);
    this.formError.set('');
    this.isModalOpen.set(true);
    
    this.educationService.getEducationById(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.educationForm.patchValue({
            degree: res.data.degree,
            university: res.data.university,
            startYear: res.data.startYear,
            endYear: res.data.endYear || null,
            gpaOrPercentage: res.data.gpaOrPercentage || '',
            description: res.data.description || ''
          });
        }
      },
      error: () => {
        this.formError.set('Failed to load education details.');
      }
    });
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    setTimeout(() => {
      this.educationForm.reset();
      this.editingId.set(null);
    }, 300);
  }

  onSubmit(): void {
    if (this.educationForm.invalid) {
      this.educationForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.formError.set('');
    
    const payload: EducationRequest = this.educationForm.value;
    const currentEditId = this.editingId();

    const request$ = currentEditId 
      ? this.educationService.updateEducation(currentEditId, payload)
      : this.educationService.createEducation(payload);

    request$.subscribe({
      next: (res) => {
        if (res.success) {
          this.loadEducation();
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

  deleteEducation(id: number): void {
    if (confirm('Are you sure you want to delete this education entry?')) {
      this.educationService.deleteEducation(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.loadEducation();
          }
        },
        error: () => {
          alert('Failed to delete education entry.');
        }
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.educationForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }
}