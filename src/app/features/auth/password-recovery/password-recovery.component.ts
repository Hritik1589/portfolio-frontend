import {
  Component,
  computed,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

export function passwordsMatchValidator(
  control: AbstractControl
): ValidationErrors | null {

  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;

  return newPassword === confirmPassword
    ? null
    : { passwordsMismatch: true };
}

@Component({
  selector: 'app-password-recovery',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './password-recovery.component.html',
  styleUrl: './password-recovery.component.scss'
})
export class PasswordRecoveryComponent {

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // ===================================
  // UI Signals
  // ===================================

  currentStep = signal<1 | 2>(1);

  isLoading = signal(false);

  showPassword = signal(false);

  errorMessage = signal('');

  successMessage = signal('');

  private userTarget = signal('');

  // ===================================
  // 3D Animation
  // ===================================

  rotateX = signal(0);

  rotateY = signal(0);

  lightX = signal(250);

  lightY = signal(250);

  particles = Array.from({ length: 25 });

  cubes = Array.from({ length: 12 });

  cardTransform = computed(() => {

    return `
      perspective(1800px)
      rotateX(${this.rotateX()}deg)
      rotateY(${this.rotateY()}deg)
      scale3d(1.02,1.02,1.02)
    `;

  });

  // ===================================
  // Forms
  // ===================================

  forgotForm = this.fb.nonNullable.group({

    target: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ]

  });

  resetForm = this.fb.nonNullable.group({

    otp: [
      '',
      [
        Validators.required,
        Validators.minLength(6)
      ]
    ],

    newPassword: [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ],

    confirmPassword: [
      '',
      Validators.required
    ]

  }, {

    validators: passwordsMatchValidator

  });

  // ===================================
  // Password Strength
  // ===================================

  passwordStrength = computed(() => {

    const password =
      this.resetForm.controls.newPassword.value;

    if (!password) {

      return 0;

    }

    let score = 0;

    if (password.length >= 8)

      score += 20;

    if (password.length >= 12)

      score += 20;

    if (/[A-Z]/.test(password))

      score += 20;

    if (/[0-9]/.test(password))

      score += 20;

    if (/[^A-Za-z0-9]/.test(password))

      score += 20;

    return score;

  });

  // ===================================
  // Mouse Animation
  // ===================================

  onMouseMove(event: MouseEvent): void {

    const page = event.currentTarget as HTMLElement;

    const rect = page.getBoundingClientRect();

    const x = event.clientX - rect.left;

    const y = event.clientY - rect.top;

    this.lightX.set(x);

    this.lightY.set(y);

    const rotateY = ((x / rect.width) - 0.5) * 18;

    const rotateX = -((y / rect.height) - 0.5) * 18;

    this.rotateX.set(rotateX);

    this.rotateY.set(rotateY);

  }

  resetTilt(): void {

    this.rotateX.set(0);

    this.rotateY.set(0);

  }

  // ===================================
  // UI
  // ===================================

  togglePassword(): void {

    this.showPassword.update(v => !v);

  }

  // ===================================
  // Forgot Password
  // ===================================

  onForgotSubmit(): void {

    if (this.forgotForm.invalid) {

      this.forgotForm.markAllAsTouched();

      return;

    }

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.successMessage.set('');

    const target =
      this.forgotForm.getRawValue().target;

    this.authService.forgotPassword({

      target

    }).subscribe({

      next: (res) => {

        this.isLoading.set(false);

        if (res.success) {

          this.userTarget.set(target);

          this.successMessage.set(
            'Reset code sent! Check your email.'
          );

          setTimeout(() => {

            this.successMessage.set('');

            this.currentStep.set(2);

          }, 1500);

        }

      },

      error: (err) => {

        this.isLoading.set(false);

        this.errorMessage.set(

          err.error?.message ||

          err.error?.error ||

          'Failed to request reset link.'

        );

      }

    });

  }

  // ===================================
  // Reset Password
  // ===================================

  onResetSubmit(): void {

    if (this.resetForm.invalid) {

      this.resetForm.markAllAsTouched();

      return;

    }

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.successMessage.set('');

    const formValues =
      this.resetForm.getRawValue();

    const payload = {

      target: this.userTarget(),

      otp: formValues.otp,

      newPassword: formValues.newPassword

    };

    this.authService.resetPassword(payload)

      .subscribe({

        next: (res) => {

          this.isLoading.set(false);

          if (res.success) {

            this.successMessage.set(

              'Password reset successfully! Redirecting...'

            );

            setTimeout(() => {

              this.router.navigate(['/login']);

            }, 2500);

          }

        },

        error: (err) => {

          this.isLoading.set(false);

          this.errorMessage.set(

            err.error?.message ||

            err.error?.error ||

            'Failed to reset password.'

          );

        }

      });

  }

}