import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminSkillService } from '../../../core/services/admin-skill.service';
import { SkillResponse, SkillRequest, SkillCategory } from '../../../core/models/skill.model';

@Component({
  selector: 'app-admin-skills',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-skills.component.html',
  styleUrl: './admin-skills.component.scss'
})
export class AdminSkillsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly skillService = inject(AdminSkillService);

  public skills = signal<SkillResponse[]>([]);
  public isLoading = signal<boolean>(true);
  public isSubmitting = signal<boolean>(false);
  
  public isModalOpen = signal<boolean>(false);
  public editingId = signal<number | null>(null);
  public formError = signal<string>('');

  // Expose the enum to the template
  public categories = Object.values(SkillCategory);

  // 🚨 FIX 1: Re-added missing computed signals required by the HTML stats grid
  public expertSkillsCount = computed(() => 
    this.skills().filter(s => s.proficiency >= 90).length
  );

  public averageProficiency = computed(() => {
    const allSkills = this.skills();
    if (allSkills.length === 0) return 0;
    const total = allSkills.reduce((sum, skill) => sum + skill.proficiency, 0);
    return Math.round(total / allSkills.length);
  });

  // Group skills by category for the UI
  public groupedSkills = computed(() => {
    const skillsArray = this.skills();
    const groups = new Map<string, SkillResponse[]>();
    
    skillsArray.forEach(skill => {
      const cat = skill.category || SkillCategory.OTHER;
      if (!groups.has(cat)) {
        groups.set(cat, []);
      }
      groups.get(cat)!.push(skill);
    });
    
    return Array.from(groups.entries()).map(([category, items]) => ({
      category,
      // Sort by display order first, then fallback to proficiency
      items: items.sort((a: any, b: any) => {
        const orderA = a.displayOrder !== undefined ? a.displayOrder : 999;
        const orderB = b.displayOrder !== undefined ? b.displayOrder : 999;
        if (orderA === orderB) return b.proficiency - a.proficiency;
        return orderA - orderB;
      })
    }));
  });

  public skillForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    category: [SkillCategory.FRONTEND, [Validators.required]],
    proficiency: [50, [Validators.required, Validators.min(0), Validators.max(100)]],
    yearsOfExperience: [null],
    iconUrl: [''],
    displayOrder: [0, [Validators.required]] // Required by backend
  });

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills(): void {
    this.isLoading.set(true);
    this.skillService.getAllSkills().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          // 🚨 FIX 2: Safely map displayOrder and yearsOfExperience in case the backend SkillResponse is missing them
          const safeData = res.data.map((skill: any) => ({
            ...skill,
            displayOrder: skill.displayOrder || 0,
            yearsOfExperience: skill.yearsOfExperience || 0
          }));
          this.skills.set(safeData);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load skills', err);
        this.isLoading.set(false);
      }
    });
  }

  openCreateModal(): void {
    this.editingId.set(null);
    this.skillForm.reset({ 
      category: SkillCategory.FRONTEND, 
      proficiency: 50, 
      displayOrder: 0 
    });
    this.formError.set('');
    this.isModalOpen.set(true);
  }

  openEditModal(id: number): void {
    this.editingId.set(id);
    this.formError.set('');
    this.isModalOpen.set(true);
    
    this.skillService.getSkillById(id).subscribe({
      next: (res: any) => {
        if (res.success && res.data) {
          const sk = res.data;
          this.skillForm.patchValue({
            name: sk.name,
            category: sk.category,
            proficiency: sk.proficiency,
            yearsOfExperience: sk.yearsOfExperience || null,
            iconUrl: sk.iconUrl || '',
            displayOrder: sk.displayOrder !== undefined ? sk.displayOrder : 0
          });
        }
      },
      error: () => {
        this.formError.set('Failed to load skill details.');
      }
    });
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    setTimeout(() => {
      this.skillForm.reset({ category: SkillCategory.FRONTEND, proficiency: 50, displayOrder: 0 });
      this.editingId.set(null);
    }, 300);
  }

  onSubmit(): void {
    if (this.skillForm.invalid) {
      this.skillForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.formError.set('');
    
    const payload: SkillRequest = this.skillForm.value;
    const currentEditId = this.editingId();

    const request$ = currentEditId 
      ? this.skillService.updateSkill(currentEditId, payload)
      : this.skillService.createSkill(payload);

    request$.subscribe({
      next: (res) => {
        if (res.success) {
          this.loadSkills();
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

  deleteSkill(id: number): void {
    if (confirm('Are you sure you want to delete this skill?')) {
      this.skillService.deleteSkill(id).subscribe({
        next: (res) => {
          if (res.success) {
            this.loadSkills();
          }
        },
        error: () => {
          alert('Failed to delete skill.');
        }
      });
    }
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.skillForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  formatCategoryName(cat: string): string {
    // 🚨 FIX 3: Replaced deprecated 'substr' with 'substring' to prevent modern TS compiler errors
    return cat.replace('_', ' ').replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase());
  }
}