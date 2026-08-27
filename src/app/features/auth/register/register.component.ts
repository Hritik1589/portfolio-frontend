import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  inject,
  signal,
  effect
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';

import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

/* ---------------------------------------------
   Password Match Validator
----------------------------------------------*/

export function passwordsMatchValidator(
  control: AbstractControl
): ValidationErrors | null {

  const password = control.get('password')?.value;
  const confirm = control.get('confirmPassword')?.value;

  return password === confirm
      ? null
      : { passwordsMismatch: true };
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements AfterViewInit {

  @ViewChild('tiltCard')
  tiltCard!: ElementRef<HTMLDivElement>;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  /* ---------------------------
      Signals
  ---------------------------- */

  isLoading = signal(false);

  showPassword = signal(false);

  errorMessage = signal('');

  successMessage = signal('');

  mouseX = signal(0);

  mouseY = signal(0);

  buttonX = signal(0);

  buttonY = signal(0);

  passwordStrength = signal(0);

  passwordStrengthLabel = signal('Weak');

  stars = Array.from({ length: 20 }, (_, i) => i);

  particles = Array.from({ length: 35 }, (_, i) => i);

  /* ----------------------------
        Form
  ----------------------------- */

  registerForm = this.fb.nonNullable.group({

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    mobile: [''],

    password: [
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

  /* ----------------------------
      Constructor
  ----------------------------- */

  constructor() {

    effect(() => {

      const password =
        this.registerForm.controls.password.value;

      this.calculateStrength(password);

    });

  }

  ngAfterViewInit(): void {}

  /* ----------------------------
      Toggle Password
  ----------------------------- */

  togglePassword() {

    this.showPassword.update(v => !v);

  }

  /* ----------------------------
      Mouse Tilt
  ----------------------------- */

  onMouseMove(event: MouseEvent) {

    if (!this.tiltCard) return;

    const card =
      this.tiltCard.nativeElement;

    const rect =
      card.getBoundingClientRect();

    const x =
      event.clientX - rect.left;

    const y =
      event.clientY - rect.top;

    this.mouseX.set(x);

    this.mouseY.set(y);

    const rotateY =
      ((x / rect.width) - .5) * 18;

    const rotateX =
      -((y / rect.height) - .5) * 18;

    card.style.transform =

      `
      perspective(1200px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.02)
      `;

  }

  resetTilt() {

    if (!this.tiltCard) return;

    this.tiltCard.nativeElement.style.transform =

      `
      perspective(1200px)
      rotateX(0deg)
      rotateY(0deg)
      scale(1)
      `;

  }

  /* ----------------------------
      Magnetic Button
  ----------------------------- */

  moveButton(event: MouseEvent) {

    const button =
      event.currentTarget as HTMLElement;

    const rect =
      button.getBoundingClientRect();

    const x =
      event.clientX - rect.left;

    const y =
      event.clientY - rect.top;

    this.buttonX.set(

      (x - rect.width / 2) / 7

    );

    this.buttonY.set(

      (y - rect.height / 2) / 7

    );

  }

  leaveButton() {

    this.buttonX.set(0);

    this.buttonY.set(0);

  }

  /* ----------------------------
      Password Strength
  ----------------------------- */

  calculateStrength(password: string) {

    let score = 0;

    if (!password) {

      this.passwordStrength.set(0);

      this.passwordStrengthLabel.set('');

      return;

    }

    if (password.length >= 8)
      score += 25;

    if (/[A-Z]/.test(password))
      score += 20;

    if (/[a-z]/.test(password))
      score += 20;

    if (/[0-9]/.test(password))
      score += 20;

    if (/[^A-Za-z0-9]/.test(password))
      score += 15;

    this.passwordStrength.set(score);

    if (score < 40)

      this.passwordStrengthLabel.set('Weak');

    else if (score < 70)

      this.passwordStrengthLabel.set('Medium');

    else if (score < 90)

      this.passwordStrengthLabel.set('Strong');

    else

      this.passwordStrengthLabel.set('Excellent');

  }

  /* ----------------------------
      Register
  ----------------------------- */

  onSubmit() {

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;

    }

    this.isLoading.set(true);

    this.errorMessage.set('');

    this.successMessage.set('');

    const {

      confirmPassword,

      ...payload

    } = this.registerForm.getRawValue();

    this.authService
      .register(payload)
      .subscribe({

        next: (res) => {

          this.isLoading.set(false);

          if (res.success) {

            this.successMessage.set(

              'Account created successfully!'

            );

            setTimeout(() => {
            this.router.navigate(['/verify-otp'], { 
              state: { email: payload.email } 
            });
          }, 2000);

          }

        },

        error: (err) => {

          this.isLoading.set(false);

          this.errorMessage.set(

            err.error?.message ||

            'Registration failed.'

          );

        }

      });

  }

}