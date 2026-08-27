import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminCertificationService } from '../../../core/services/admin-certification.service';
import { CertificationResponse, CertificationRequest } from '../../../core/models/certification.model';

@Component({
  selector: 'app-admin-certifications',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-certifications.component.html',
  styleUrl: './admin-certifications.component.scss'
})
export class AdminCertificationsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly certificationService = inject(AdminCertificationService);

  // State Signals
  public certifications = signal<CertificationResponse[]>([]);
  public isLoading = signal<boolean>(true);
  public isSubmitting = signal<boolean>(false);
  
  // Modal State
  public isModalOpen = signal<boolean>(false);
  public editingId = signal<number | null>(null);
  public formError = signal<string>('');

  public certForm: FormGroup = this.fb.group({
    certificateName: ['', [Validators.required, Validators.minLength(2)]],
    issuingOrganization: ['', Validators.required],
    issueDate: ['', Validators.required],
    expirationDate: [''],
    credentialId: [''],
    credentialUrl: [''],
    description: ['']
  });

  ngOnInit(): void {
    this.loadCertifications();
  }

  loadCertifications(): void {
    this.isLoading.set(true);
    this.certificationService.getAllCertifications().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.certifications.set(res.data);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load certifications', err);
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.editingId.set(null);
    this.certForm.reset();
    this.formError.set('');
    this.isModalOpen.set(true);
  }

  openEditModal(id: number): void {
    this.editingId.set(id);
    this.formError.set('');
    this.isModalOpen.set(true);
    
    // Optional: Set loader in modal while fetching
    this.certificationService.getCertificationById(id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.certForm.patchValue({
            certificateName: res.data.certificateName,
            issuingOrganization: res.data.issuingOrganization,
            issueDate: res.data.issueDate,
            expirationDate: res.data.expirationDate || '',
            credentialId: res.data.credentialId || '',
            credentialUrl: res.data.credentialUrl || '',
            description: res.data.description || ''
          });
        }
      },
      error: (err) => {
        this.formError.set('Failed to load certification details.');
      }
    });
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    setTimeout(() => {
      this.certForm.reset();
      this.editingId.set(null);
    }, 300); // Wait for animation
  }

  onSubmit(): void {
    if (this.certForm.invalid) {
      this.certForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.formError.set('');
    
    const payload: CertificationRequest = this.certForm.value;
    const currentEditId = this.editingId();

    const request$ = currentEditId 
      ? this.certificationService.updateCertification(currentEditId, payload)
      : this.certificationService.createCertification(payload);

    request$.subscribe({
      next: (res) => {
        if (res.success) {
          this.loadCertifications();
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

  deleteCertification(id: number): void {
    if (confirm('Are you sure you want to delete this certification? This action cannot be undone.')) {
      this.certificationService.deleteCertification(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.loadCertifications();
          }
        },
        error: (err) => {
          alert('Failed to delete certification.');
        }
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.certForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }
}