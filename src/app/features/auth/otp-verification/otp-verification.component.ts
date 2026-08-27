import {
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  ViewChild,
  inject,
  signal,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './otp-verification.component.html',
  styleUrl: './otp-verification.component.scss'
})
export class OtpVerificationComponent implements OnInit {

  @ViewChildren('otpInput')
  otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  @ViewChild('tiltCard')
  tiltCard!: ElementRef<HTMLDivElement>;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  isSuccess = signal(false);
  errorMessage = signal('');

  userEmail = signal('');

  mouseX = signal(0);
  mouseY = signal(0);

  buttonX = signal(0);
  buttonY = signal(0);

  resendCountdown = signal(60);

  stars = Array.from({ length: 45 }, () => ({
  left: Math.random() * 100,
  top: Math.random() * 100,
  delay: Math.random() * 5,
  duration: 2 + Math.random() * 4
}));

particles = Array.from({ length: 35 }, () => ({
  left: Math.random() * 100,
  delay: -(Math.random() * 20),
  duration: 10 + Math.random() * 15,
  scale: 0.5 + Math.random() * 1.5
}));

shootingStars = Array.from({ length: 5 }, () => ({
  top: Math.random() * 60,
  delay: Math.random() * 12
}));


  otpForm = this.fb.group({
    digits: this.fb.array(
      Array.from({ length: 6 }, () =>
        new FormControl('', [
          Validators.required,
          Validators.pattern(/^\d$/)
        ])
      )
    )
  });

  get digitsArray(): FormArray {
    return this.otpForm.get('digits') as FormArray;
  }

  ngOnInit(): void {

    const email = history.state?.email;

    if (email) {
      this.userEmail.set(email);
    }

    this.startCountdown();

  }

  /* ==========================
      3D CARD
  ========================== */

  onMouseMove(event: MouseEvent): void {

    const card = this.tiltCard.nativeElement;

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;

    const y = event.clientY - rect.top;

    this.mouseX.set(x);

    this.mouseY.set(y);

    const rotateY = ((x / rect.width) - 0.5) * 20;

    const rotateX = ((rect.height / 2 - y) / rect.height) * 20;

    card.style.transform =
      `perspective(1200px)
       rotateX(${rotateX}deg)
       rotateY(${rotateY}deg)
       scale(1.02)`;

  }

  resetTilt(): void {

    if (!this.tiltCard) return;

    this.tiltCard.nativeElement.style.transform =
      'perspective(1200px) rotateX(0deg) rotateY(0deg) scale(1)';

  }

  /* ==========================
      BUTTON MAGNET
  ========================== */

  moveButton(event: MouseEvent): void {

    const target = event.currentTarget as HTMLElement;

    const rect = target.getBoundingClientRect();

    const x = event.clientX - rect.left - rect.width / 2;

    const y = event.clientY - rect.top - rect.height / 2;

    this.buttonX.set(x * 0.15);

    this.buttonY.set(y * 0.15);

  }

  leaveButton(): void {

    this.buttonX.set(0);

    this.buttonY.set(0);

  }

  /* ==========================
      OTP INPUT
  ========================== */

  onInput(event: Event, index: number): void {

    const input = event.target as HTMLInputElement;

    const value = input.value;

    if (value && !/^\d$/.test(value)) {

      this.digitsArray.at(index).setValue('');

      return;

    }

    if (value && index < 5) {

      this.otpInputs.toArray()[index + 1].nativeElement.focus();

    }

    if (this.otpForm.valid) {

      this.onSubmit();

    }

  }

  onKeyDown(event: KeyboardEvent, index: number): void {

    if (event.key === 'Backspace') {

      if (!this.digitsArray.at(index).value && index > 0) {

        this.otpInputs.toArray()[index - 1].nativeElement.focus();

        this.digitsArray.at(index - 1).setValue('');

      } else {

        this.digitsArray.at(index).setValue('');

      }

    }

  }

  onPaste(event: ClipboardEvent): void {

    event.preventDefault();

    const pasted = event.clipboardData?.getData('text');

    if (!pasted) return;

    const digits = pasted.replace(/\D/g, '').substring(0, 6).split('');

    digits.forEach((d, i) => {

      this.digitsArray.at(i).setValue(d);

    });

    if (this.otpForm.valid) {

      this.onSubmit();

    }

  }

  /* ==========================
      VERIFY
  ========================== */

 onSubmit(): void {
    if (this.otpForm.invalid) {
      this.errorMessage.set('Please enter a valid 6-digit code.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const otpCode = this.digitsArray.value.join('');
    // Fallback email for testing if none is provided via state
    const userEmail = this.userEmail() || 'test@example.com'; 

    // 🚨 PERFECTLY MATCHING THE JAVA DTO
    const requestPayload = {
      target: userEmail,
      otp: otpCode,
      targetType: 'EMAIL'
    };

    this.authService.verifyOtp(requestPayload).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.success) {
          this.isSuccess.set(true); // Triggers visual lock animation
          
          // Wait for animation to finish before routing
          setTimeout(() => {
            this.router.navigate(['/login']); // Route to login or dashboard
          }, 2500);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        
        let errorMsg = 'Invalid OTP code.';
        if (typeof err.error === 'string') {
          errorMsg = err.error;
        } else if (err?.error?.message) {
          errorMsg = err.error.message;
        } else if (err?.error?.error) {
          errorMsg = err.error.error;
        }

        this.errorMessage.set(errorMsg);

        // Clear inputs on error for retry
        this.digitsArray.controls.forEach(ctrl => ctrl.setValue(''));
        this.otpInputs.toArray()[0].nativeElement.focus();
      }
    });

  }

  /* ==========================
      RESEND
  ========================== */

  resendOtp(): void {

    this.resendCountdown.set(60);

    this.startCountdown();

    console.log('Resend OTP');

    // this.authService.resendOtp(...)

  }

  startCountdown(): void {

    const timer = setInterval(() => {

      if (this.resendCountdown() <= 0) {

        clearInterval(timer);

        return;

      }

      this.resendCountdown.update(v => v - 1);

    }, 1000);

  }

}