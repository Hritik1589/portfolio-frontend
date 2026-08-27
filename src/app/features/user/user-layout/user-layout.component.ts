// src/app/features/user/user-layout/user-layout.component.ts
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.scss'
})
export class UserLayoutComponent {
  private readonly router = inject(Router);
  public isMobileMenuOpen = signal<boolean>(false);

  toggleMenu(): void {
    this.isMobileMenuOpen.update(val => !val);
  }

  closeMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  logout(): void {
    // Clear your auth tokens here
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}