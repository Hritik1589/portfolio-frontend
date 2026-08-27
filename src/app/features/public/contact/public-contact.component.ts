// src/app/features/public/public-contact/public-contact.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule,Location } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicContactService } from '../../../core/services/public-contact.service';
import { ContactMessageRequest } from '../../../core/models/contact-message.model';

@Component({
  selector: 'app-public-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './public-contact.component.html',
  styleUrl: './public-contact.component.scss'
})
export class PublicContactComponent {
  private readonly fb = inject(FormBuilder);
  private readonly contactService = inject(PublicContactService);

  public isSubmitting = signal<boolean>(false);
  public successMessage = signal<string | null>(null);
  public errorMessage = signal<string | null>(null);

  private readonly location = inject(Location); // 🚨 Inject Location

  // ... your existing form and submit logic ...

  public goBack(): void {
    this.location.back(); // Physically takes them to whatever page they came from
  }

  public contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    mobileNumber: ['', [Validators.pattern('^[0-9+ ]*$')]], // Optional but validated if entered
    subject: ['', [Validators.required, Validators.minLength(3)]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  public onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.successMessage.set(null);
    this.errorMessage.set(null);

    const payload: ContactMessageRequest = this.contactForm.value;

    this.contactService.sendMessage(payload).subscribe({
      next: (res) => {
        if (res.success) {
          this.successMessage.set('Thank you! Your message has been sent successfully. I will get back to you soon.');
          this.contactForm.reset();
        } else {
          this.errorMessage.set(res.message || 'Failed to send message.');
        }
        this.isSubmitting.set(false);
      },
      error: (err) => {
        console.error('Error sending message', err);
        this.errorMessage.set('An unexpected error occurred. Please try again later.');
        this.isSubmitting.set(false);
      }
    });
  }

  // Helper method for form validation styling
  public isFieldInvalid(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }
}