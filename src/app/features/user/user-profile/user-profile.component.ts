import { Component, OnInit, ElementRef, ViewChild, computed,inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserProfileService } from '../../../core/services/user-profile.service';
import { UserProfileResponse } from '../../../core/models/user-profile.model';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent implements OnInit {
  
  @ViewChild('tiltCard') tiltCard!: ElementRef<HTMLDivElement>;

  private readonly fb = inject(FormBuilder);
  private readonly profileService = inject(UserProfileService);

  // State Signals
  public userProfile = signal<UserProfileResponse | null>(null);
  public isLoading = signal<boolean>(true);
  public isSaving = signal<boolean>(false);
  public successMessage = signal<string>('');
  public errorMessage = signal<string>('');

  // 3D Tilt Signals
  public cardRotateX = signal(0);
  public cardRotateY = signal(0);

  // Reactive Form
  public profileForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: [{ value: '', disabled: true }], // Read-only
    mobile: ['', [Validators.pattern('^[0-9]{10,15}$')]]
  });

  ngOnInit(): void {
    this.fetchProfile();
  }

  public profileStrength = computed(() => {
    const profile = this.userProfile();
    if (!profile) return 0;
    
    let strength = 0;
    if (profile.name && profile.name.trim() !== '') strength += 33;
    if (profile.email && profile.email.trim() !== '') strength += 33;
    if (profile.mobile && profile.mobile.trim() !== '') strength += 34; // Equals 100%
    
    return strength;
  });

  fetchProfile(): void {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.userProfile.set(res.data);
          this.profileForm.patchValue({
            name: res.data.name,
            email: res.data.email,
            mobile: res.data.mobile || ''
          });
          
          // Update Dashboard Greeting
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          storedUser.name = res.data.name;
          localStorage.setItem('user', JSON.stringify(storedUser));
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load profile details.');
        this.isLoading.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    const updateData = {
      name: this.profileForm.getRawValue().name,
      mobile: this.profileForm.getRawValue().mobile
    };

    this.profileService.updateProfile(updateData).subscribe({
      next: (res) => {
        this.isSaving.set(false);
        if (res.success && res.data) {
          this.successMessage.set('Profile updated successfully!');
          this.userProfile.set(res.data);
          
          const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
          storedUser.name = res.data.name;
          localStorage.setItem('user', JSON.stringify(storedUser));

          setTimeout(() => this.successMessage.set(''), 4000);
        }
      },
      error: (err) => {
        this.isSaving.set(false);
        this.errorMessage.set(err?.error?.message || 'Failed to update profile.');
        setTimeout(() => this.errorMessage.set(''), 4000);
      }
    });
  }

  // 3D Card Mechanics
  onMouseMove(event: MouseEvent): void {
    if (!this.tiltCard) return;
    const rect = this.tiltCard.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    this.cardRotateY.set(((x - centerX) / centerX) * 10);
    this.cardRotateX.set(-((y - centerY) / centerY) * 10);
  }

  resetTilt(): void {
    this.cardRotateX.set(0);
    this.cardRotateY.set(0);
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }
}