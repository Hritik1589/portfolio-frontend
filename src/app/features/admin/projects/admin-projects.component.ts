import {
  Component,
  OnInit,
  OnDestroy,
  AfterViewInit,
  inject,
  signal,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { AdminProjectService } from '../../../core/services/admin-project.service';
import { ProjectRequest, ProjectResponse } from '../../../core/models/project.model';

@Component({
  selector: 'app-admin-projects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-projects.component.html',
  styleUrl: './admin-projects.component.scss'
})
export class AdminProjectsComponent
  implements OnInit, AfterViewInit, OnDestroy {

  private readonly projectService = inject(AdminProjectService);
  private readonly fb = inject(FormBuilder);

  // ===============================
  // Existing State (UNCHANGED)
  // ===============================

  projects = signal<ProjectResponse[]>([]);
  isLoading = signal(true);
  isSubmitting = signal(false);

  isModalOpen = signal(false);
  editingProjectId = signal<number | null>(null);

  projectForm = this.fb.nonNullable.group({
    title: ['', Validators.required],
    slug: ['', Validators.required],                         // 🚨 New
    shortDescription: ['', Validators.required],             // 🚨 New
    detailedDescription: ['', Validators.required],          // 🚨 New
    startDate: ['', Validators.required],                    // 🚨 New
    imageUrl: ['', Validators.required],
    liveUrl: [''],
    githubUrl: [''],
    technologies: ['', Validators.required]
  });

  // ===============================
  // Animation State
  // ===============================

  private animationId = 0;

  mouseX = signal(0);
  mouseY = signal(0);

  // ===============================
  // Lifecycle
  // ===============================

  ngOnInit(): void {
    this.loadProjects();
    this.startBackgroundAnimation();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const rows = document.querySelectorAll('.project-row');
      rows.forEach((row, index) => {
        (row as HTMLElement).animate(
          [
            { opacity: 0, transform: 'translateY(30px)' },
            { opacity: 1, transform: 'translateY(0px)' }
          ],
          { duration: 600, delay: index * 70, easing: 'ease-out', fill: 'forwards' }
        );
      });
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
  }

  // ===============================
  // Mouse Tracking
  // ===============================

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.mouseX.set(event.clientX);
    this.mouseY.set(event.clientY);
  }

  private startBackgroundAnimation(): void {
    const animate = () => {
      const orb1 = document.querySelector('.orb-1') as HTMLElement | null;
      const orb2 = document.querySelector('.orb-2') as HTMLElement | null;

      if (orb1) {
        orb1.style.transform = `translate(${this.mouseX() * 0.015}px, ${this.mouseY() * 0.015}px)`;
      }
      if (orb2) {
        orb2.style.transform = `translate(${-this.mouseX() * 0.012}px, ${-this.mouseY() * 0.012}px)`;
      }
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  // ===============================
  // 3D Card Hover
  // ===============================

  cardMove(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 18;
    const rotateX = ((rect.height / 2 - y) / rect.height) * 18;

    card.style.transform = `
      perspective(1200px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-8px)
      scale(1.02)
    `;
  }

  leaveCard(event: MouseEvent): void {
    const card = event.currentTarget as HTMLElement;
    card.style.transform = `
      perspective(1200px)
      rotateX(0deg)
      rotateY(0deg)
      translateY(0px)
      scale(1)
    `;
  }

  // ===============================
  // CRUD Logic (UPDATED WITH ALERTS)
  // ===============================

  loadProjects(): void {
    this.isLoading.set(true);
    this.projectService.getAllProjects().subscribe({
      next: (res: any) => {
        // Safely handle both Paginated (res.data.content) or List (res.data) responses
        this.projects.set(res.data?.content || res.data || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.isLoading.set(false);
      }
    });
  }

  openModal(project?: ProjectResponse): void {
    this.isModalOpen.set(true);
    if (project) {
      this.editingProjectId.set(project.id);
      
      let techString = '';
      if (Array.isArray(project.technologies)) {
        // 🚨 FIX: Extract the .name property out of the object before joining with commas!
        techString = project.technologies.map(t => t.name? t.name : t).join(', ');
      } else if (typeof project.technologies === 'string') {
        techString = project.technologies;
      }

      this.projectForm.patchValue({
        ...project,
        technologies: techString
      });
    } else {
      this.editingProjectId.set(null);
      this.projectForm.reset();
    }
  }
  closeModal(): void {
    this.isModalOpen.set(false);
    this.projectForm.reset();
    this.editingProjectId.set(null);
  }

  onSubmit(): void {
    
    // 🚨 NEW: Dynamic Validation Checker
    if (this.projectForm.invalid) {
      const invalidFields = [];
      const controls = this.projectForm.controls;
      
      // Loop through all form controls to see which one is failing
      for (const name in controls) {
        if (controls[name as keyof typeof controls].invalid) {
          invalidFields.push(name);
        }
      }

      alert("Validation Failed! You are missing or have errors in: " + invalidFields.join(', '));
      this.projectForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.projectForm.getRawValue();

    const { technologies, ...restOfForm } = formValue;
    let techArray: string[] = [];
    if (typeof technologies === 'string') {
      techArray = technologies.split(',').map(t => t.trim()).filter(t => t.length > 0);
    } else if (Array.isArray(technologies)) {
      techArray = technologies;
    }

    const request: ProjectRequest = {
      ...restOfForm,
      // ✅ Just pass the techArray you created on the line above!
      technologies: techArray
    };

    const editId = this.editingProjectId();

    if (editId) {
      this.projectService.updateProject(editId, request).subscribe({
        next: () => {
          this.loadProjects();
          this.closeModal();
          this.isSubmitting.set(false);
          alert("Success: Project updated!"); 
        },
        error: err => {
          console.error(err);
          this.isSubmitting.set(false);
          alert(`Update Error: ${err.status} - ${err.message}`); 
        }
      });
    } else {
      this.projectService.createProject(request).subscribe({
        next: () => {
          this.loadProjects();
          this.closeModal();
          this.isSubmitting.set(false);
          alert("Success: Project created!"); 
        },
        error: err => {
          console.error(err);
          this.isSubmitting.set(false);
          alert(`Creation Error: ${err.status} - ${err.message}`);
        }
      });
    }
  }

  deleteProject(id: number): void {
    if (confirm('Are you sure you want to delete this project? This cannot be undone.')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.loadProjects();
          alert("Success: Project deleted!"); // SUCCESS ALERT
        },
        error: err => {
          console.error(err);
          alert(`Delete Error: ${err.status} - ${err.message}`); // ERROR ALERT
        }
      });
    }
  }
}