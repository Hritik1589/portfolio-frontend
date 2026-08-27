import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  OnInit, // 🚨 Added OnInit import
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy { // 🚨 Added OnInit

  @ViewChild('tiltCard')
  tiltCard!: ElementRef<HTMLDivElement>;

  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // ============================
  // Signals
  // ============================

  isLoading = signal(false);
  showPassword = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  mouseX = signal(0);
  mouseY = signal(0);

  // ============================
  // Form
  // ============================

  loginForm = this.fb.nonNullable.group({
    username: ['', Validators.required],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(8)
      ]
    ]
  });

  // 🚨 Clears old data when the login page loads
  ngOnInit(): void {
    localStorage.clear(); 
  }

  // ============================
  // 3D Tilt Variables
  // ============================

  private targetRotateX = 0;
  private targetRotateY = 0;
  private currentRotateX = 0;
  private currentRotateY = 0;
  private animationId = 0;

  // ============================
  // Lifecycle
  // ============================

  ngAfterViewInit(): void {
    this.animateCard();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
  }

  // ============================
  // Mouse Tilt
  // ============================

  onMouseMove(event: MouseEvent): void {
    if (!this.tiltCard) return;
    const rect = this.tiltCard.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    this.mouseX.set(x);
    this.mouseY.set(y);
    
    this.targetRotateY = ((x / rect.width) - 0.5) * 18;
    this.targetRotateX = -((y / rect.height) - 0.5) * 18;
  }

  resetTilt(): void {
    this.targetRotateX = 0;
    this.targetRotateY = 0;
  }

  private animateCard(): void {
    this.currentRotateX += (this.targetRotateX - this.currentRotateX) * 0.08;
    this.currentRotateY += (this.targetRotateY - this.currentRotateY) * 0.08;

    if (this.tiltCard) {
      this.tiltCard.nativeElement.style.transform = `
        perspective(1800px)
        rotateX(${this.currentRotateX}deg)
        rotateY(${this.currentRotateY}deg)
        scale3d(1.02,1.02,1.02)
      `;
    }

    this.animationId = requestAnimationFrame(() => this.animateCard());
  }

  // ============================
  // Password
  // ============================

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  // ============================
  // Login
  // ============================

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.authService
      .login(this.loginForm.getRawValue())
      .subscribe({
        next: (response) => {
          this.isLoading.set(false);

          if (response.success) {
            this.successMessage.set('Welcome back!');
            
            const roles: string[] = response.data?.roles || [];

            // 1. Save session state & token
            localStorage.setItem('user_active', 'true');
            if (response.data?.accessToken) {
              localStorage.setItem('access_token', response.data.accessToken);
              localStorage.setItem('token', response.data.accessToken); // Saved as both just in case your interceptor uses 'token'
            }

            // 2. 🚨 CRITICAL: Save the user object with roles so the roleGuard can read it
            const userObj = { roles: roles };
            localStorage.setItem('user', JSON.stringify(userObj));

            // 3. Smoothly redirect based on user role
            setTimeout(() => {
              if (roles.includes('ROLE_ADMIN') || roles.includes('ADMIN')) {
                this.router.navigate(['/admin/dashboard']);
              } else if (roles.includes('ROLE_USER') || roles.includes('USER')) {
                this.router.navigate(['/user/dashboard']);
              } else {
                this.router.navigate(['/']);
              }
            }, 1000);
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          const errorMsg = err?.error?.message || err?.error?.error || 'Unable to login.';
          this.errorMessage.set(errorMsg);

          const errorLower = errorMsg.toLowerCase();
          const isDisabledError = errorLower.includes('disabled') || 
                                  errorLower.includes('inactive') || 
                                  errorLower.includes('not verified');
                                  
          if (isDisabledError) {
            this.errorMessage.set('Account not verified. Redirecting to OTP...');
            const userEmail = this.loginForm.getRawValue().username;
            
            setTimeout(() => {
              this.router.navigate(['/verify-otp'], { 
                state: { email: userEmail } 
              });
            }, 1500);
          }
        }
      });
  }
}