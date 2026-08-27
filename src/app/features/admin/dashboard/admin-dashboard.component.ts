import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  signal,
  computed
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminDashboardService } from '../../../core/services/admin-dashboard.service';
import { AdminProjectService } from '../../../core/services/admin-project.service';
import { AdminBlogService } from '../../../core/services/admin-blog.service';
import { AdminAchievementService } from '../../../core/services/admin-achievement.service';
interface Particle {
  id: number;
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit, OnDestroy {

  private readonly dashboardService = inject(AdminDashboardService);
  private readonly projectService = inject(AdminProjectService); // 🚨 NEW
  private readonly blogService = inject(AdminBlogService); // 🚨 NEW
  private readonly achievementService = inject(AdminAchievementService);
  private readonly router = inject(Router);
  // ==========================
  // Existing Logic (UNCHANGED)
  // ==========================

  public unreadMessages = signal<number>(0);
  public totalProjects = signal<number>(0);
  public totalVisitors = signal<number>(0);
  public totalAchievements = signal<number>(0);
  public isLoading = signal<boolean>(true);
  public totalBlogs = signal<number>(0);

  // ==========================
  // UI Signals
  // ==========================

  public mouseX = signal(0);
  public mouseY = signal(0);

  public cardRotateX = signal(0);
  public cardRotateY = signal(0);

  public today = signal(new Date());

  public greeting = computed(() => {
    const hour = this.today().getHours();

    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    if (hour < 21) return 'Good Evening';

    return 'Good Night';
  });

  public particles = signal<Particle[]>([]);

  private timer?: number;

  // ==========================
  // Init
  // ==========================

  ngOnInit(): void {

    // Existing
    this.fetchUnreadCount();

    this.fetchProjectCount(); 
    this.fetchBlogCount();
    this.fetchVisitorCount();

    // UI
    this.generateParticles();
    this.fetchAchievementCount();

    this.timer = window.setInterval(() => {
      this.today.set(new Date());
    }, 1000);

  }

  ngOnDestroy(): void {

    if (this.timer) {
      clearInterval(this.timer);
    }

  }

  // ==========================
  // Existing API Logic
  // ==========================

  fetchUnreadCount(): void {

    this.dashboardService.getUnreadMessageCount().subscribe({

      next: (res) => {

        if (res.success && res.data !== undefined) {
          this.unreadMessages.set(res.data);
        }

        this.isLoading.set(false);

      },

      error: (err) => {

        console.error('Failed to fetch unread messages', err);

        this.isLoading.set(false);

      }

    });

  }
  fetchProjectCount(): void {
    this.projectService.getAllProjects().subscribe({
      next: (res: any) => {
        const projects = res.data?.content || res.data || [];
        this.totalProjects.set(projects.length);
      },
      error: (err) => console.error('Failed to fetch projects for dashboard', err)
    });
  }

  fetchBlogCount(): void {
    this.blogService.getAllBlogs().subscribe({
      next: (res: any) => {
        const blogs = res.data?.content || res.data || [];
        this.totalBlogs.set(blogs.length);
      },
      error: (err) => console.error('Failed to fetch blogs for dashboard', err)
    });
  }
  fetchVisitorCount(): void {
    this.dashboardService.getVisitorCount().subscribe({
      next: (res: any) => {
        const count = res.data !== undefined ? res.data : (res || 0);
        this.totalVisitors.set(count);
      },
      error: (err) => console.error('Failed to fetch visitor count', err)
    });
  }
  fetchAchievementCount(): void {
    this.achievementService.getAllAchievements().subscribe({
      next: (res: any) => {
        const achievements = res.data?.content || res.data || [];
        this.totalAchievements.set(achievements.length);
      },
      error: (err) => console.error('Failed to fetch achievements for dashboard', err)
    });
  }

  navigateToBlogs(): void {
    this.router.navigate(['/admin/blogs']);
  }

  // 🚨 NEW: Routing Method
  navigateToProjects(): void {
    this.router.navigate(['/admin/projects']);
  }

  navigateToMessages(): void {
    this.router.navigate(['/admin/messages']);
  }

  navigateToCertifications(): void {
    this.router.navigate(['/admin/certifications']);
  }
navigateToAchievements(): void {
    this.router.navigate(['/admin/achievements']);
  }
  // ==========================
  // Mouse 3D Card Effect
  // ==========================

  moveCard(event: MouseEvent): void {

    const card = event.currentTarget as HTMLElement;

    const rect = card.getBoundingClientRect();

    const x = event.clientX - rect.left;

    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;

    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 12;

    const rotateX = -((y - centerY) / centerY) * 12;

    this.cardRotateX.set(rotateX);
    this.cardRotateY.set(rotateY);

    this.mouseX.set(x);
    this.mouseY.set(y);

  }

  leaveCard(): void {

    this.cardRotateX.set(0);
    this.cardRotateY.set(0);

  }

  // ==========================
  // Floating Particles
  // ==========================

  generateParticles(): void {

    const arr: Particle[] = [];

    for (let i = 0; i < 25; i++) {

      arr.push({

        id: i,

        left: Math.random() * 100,

        top: Math.random() * 100,

        size: Math.random() * 5 + 2,

        duration: Math.random() * 18 + 10,

        delay: Math.random() * 8

      });

    }

    this.particles.set(arr);

  }

}