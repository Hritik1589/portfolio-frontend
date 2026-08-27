// src/app/features/user/user-dashboard/user-dashboard.component.ts
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit {
  public userName = signal<string>('Explorer');
  public currentTime = signal<Date>(new Date());

  ngOnInit(): void {
    this.extractUserName();
    
    // Simple clock for the greeting
    setInterval(() => {
      this.currentTime.set(new Date());
    }, 60000);
  }

  private extractUserName(): void {
    try {
      const userStr = localStorage.getItem('user'); // Assuming you store user obj here on login
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.name) {
          // Get first name
          this.userName.set(user.name.split(' ')[0]);
        }
      }
    } catch (e) {
      console.error('Could not parse user data', e);
    }
  }

  public getGreeting(): string {
    const hour = this.currentTime().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    if (hour < 21) return 'Good evening';
    return 'Good night';
  }
  
}