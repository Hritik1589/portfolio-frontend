import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminExperienceService } from '../../../core/services/admin-experience.service';
import { ExperienceResponse, ExperienceRequest } from '../../../core/models/experience.model';

@Component({
  selector: 'app-admin-experiences',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-experiences.component.html',
  styleUrl: './admin-experiences.component.scss'
})
export class AdminExperiencesComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly experienceService = inject(AdminExperienceService);

  public experiences = signal<ExperienceResponse[]>([]);
  
  public totalExperiences = computed(() =>
    this.experiences().length
  );

  public currentExperiences = computed(() =>
    this.experiences().filter(exp => exp.isCurrent).length
  );

  public previousExperiences = computed(() =>
    this.experiences().filter(exp => !exp.isCurrent).length
  );
  
  public isLoading = signal<boolean>(true);
  public isSubmitting = signal<boolean>(false);
  
  public isModalOpen = signal<boolean>(false);
  public editingId = signal<number | null>(null);
  public formError = signal<string>('');

  public experienceForm: FormGroup = this.fb.group({
    company: ['', [Validators.required]],
    role: ['', [Validators.required]],
    startDate: ['', [Validators.required]],
    endDate: [''],
    isCurrent: [false],
    description: ['', [Validators.required]],
    achievements: ['']
  });

  ngOnInit(): void {
    this.loadExperiences();
    this.setupIsCurrentListener();
  }

  // 🚨 Disables and clears the End Date if "I currently work here" is checked
  private setupIsCurrentListener(): void {
    this.experienceForm.get('isCurrent')?.valueChanges.subscribe((isCurrent: boolean) => {
      const endDateCtrl = this.experienceForm.get('endDate');
      if (isCurrent) {
        endDateCtrl?.disable();
        endDateCtrl?.setValue(null);
      } else {
        endDateCtrl?.enable();
      }
    });
  }

  loadExperiences(): void {
    this.isLoading.set(true);
    this.experienceService.getAllExperiences().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          
          // 🚨 FIX: Map the data to handle Spring Boot's Jackson boolean serialization
          const mappedData = res.data.map((exp: any) => ({
            ...exp,
            // Fallback to checking 'current' if 'isCurrent' is undefined
            isCurrent: exp.isCurrent !== undefined ? exp.isCurrent : exp.current || false
          }));

          // Sort by start date descending
          const sorted = mappedData.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
          this.experiences.set(sorted);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load experiences', err);
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.editingId.set(null);
    this.experienceForm.reset({ isCurrent: false });
    this.experienceForm.get('endDate')?.enable();
    this.formError.set('');
    this.isModalOpen.set(true);
  }

  openEditModal(id: number): void {
    this.editingId.set(id);
    this.formError.set('');
    this.isModalOpen.set(true);
    
    this.experienceService.getExperienceById(id).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          const exp = res.data;
          
          // 🚨 FIX: Ensure we map the boolean correctly when opening the edit modal
          const isCurrentVal = exp.isCurrent !== undefined ? exp.isCurrent : exp.current || false;

          this.experienceForm.patchValue({
            company: exp.company,
            role: exp.role,
            startDate: exp.startDate,
            isCurrent: isCurrentVal,
            endDate: exp.endDate || '',
            description: exp.description || '',
            achievements: exp.achievements || ''
          });
        }
      },
      error: () => {
        this.formError.set('Failed to load experience details.');
      }
    });
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    setTimeout(() => {
      this.experienceForm.reset({ isCurrent: false });
      this.experienceForm.get('endDate')?.enable();
      this.editingId.set(null);
    }, 300);
  }

  onSubmit(): void {
    if (this.experienceForm.invalid) {
      this.experienceForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.formError.set('');
    
    // getRawValue() ensures we grab the endDate even if it is disabled
    const rawValue = this.experienceForm.getRawValue();
    
    // 🚨 FIX: We send BOTH 'isCurrent' and 'current' back to Java to guarantee mapping
    const payload: any = {
      ...rawValue,
      current: rawValue.isCurrent
    };
    
    const currentEditId = this.editingId();

    const request$ = currentEditId 
      ? this.experienceService.updateExperience(currentEditId, payload)
      : this.experienceService.createExperience(payload);

    request$.subscribe({
      next: (res) => {
        if (res.success) {
          this.loadExperiences();
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

  deleteExperience(id: number): void {
    if (confirm('Are you sure you want to delete this experience entry?')) {
      this.experienceService.deleteExperience(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.loadExperiences();
          }
        },
        error: () => {
          alert('Failed to delete experience entry.');
        }
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.experienceForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }
}