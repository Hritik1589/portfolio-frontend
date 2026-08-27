import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublicCertificationService } from '../../../core/services/public-certification.service';
import { CertificationResponse } from '../../../core/models/certification.model';

@Component({
  selector: 'app-public-certifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './public-certifications.component.html',
  styleUrl: './public-certifications.component.scss'
})
export class PublicCertificationsComponent implements OnInit {
  private readonly certService = inject(PublicCertificationService);

  public certifications = signal<CertificationResponse[]>([]);
  public isLoading = signal<boolean>(true);
  public errorMessage = signal<string | null>(null);

  onCardMove(event: MouseEvent): void {

  const card = event.currentTarget as HTMLElement;

  const rect = card.getBoundingClientRect();

  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = -((y - centerY) / centerY) * 8;
  const rotateY = ((x - centerX) / centerX) * 8;

  card.style.transform =
    `perspective(1200px)
     rotateX(${rotateX}deg)
     rotateY(${rotateY}deg)
     translateY(-10px)
     scale(1.02)`;

  card.style.setProperty('--mx', `${x}px`);
  card.style.setProperty('--my', `${y}px`);
}

resetCard(event: MouseEvent): void {

  const card = event.currentTarget as HTMLElement;

  card.style.transform =
    'perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)';

}

  ngOnInit(): void {
    this.fetchCertifications();
  }

  private fetchCertifications(): void {
    this.isLoading.set(true);
    this.certService.getAllCertifications().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.certifications.set(res.data);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load public certifications', err);
        this.errorMessage.set('Unable to load certifications at this time.');
        this.isLoading.set(false);
      }
    });
  }
}