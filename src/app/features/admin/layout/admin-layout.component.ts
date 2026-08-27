import {
  Component,
  signal,
  inject,
  HostListener
} from '@angular/core';
import {
  CommonModule
} from '@angular/common';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  NavigationEnd
} from '@angular/router';
import { filter } from 'rxjs/operators';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.scss'
})
export class AdminLayoutComponent {
    

  private readonly router = inject(Router);

  // ==========================
  // EXISTING LOGIC
  // ==========================

  navigateToDashboard(): void {
  this.router.navigate(['/admin/dashboard']);
}

  public isSidebarOpen = signal(false);

  public navItems: NavItem[] = [

    {
      label: 'Dashboard',
      route: '/admin/dashboard',
      icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z'
    },

    {
      label: 'About',
      route: '/admin/about',
      icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
    },

    {
      label: 'Blogs',
      route: '/admin/blogs',
      icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z'
    },

    {
      label: 'Certifications',
      route: '/admin/certifications',
      icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
    },

    {
      label: 'Education',
      route: '/admin/education',
      icon: 'M12 14l9-5-9-5-9 5 9 5'
    },

    {
      label: 'Experience',
      route: '/admin/experiences',
      icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    },

    {
      label: 'Projects',
      route: '/admin/projects',
      icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4'
    },

    {
      label: 'Skills',
      route: '/admin/skills',
      icon: 'M13 10V3L4 14h7v7l9-11h-7z'
    },

    {
      label: 'Messages',
      route: '/admin/messages',
      icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    }

  ];

  // ==========================
  // NEW UI SIGNALS
  // ==========================

  public mouseX = signal(0);
  public mouseY = signal(0);

  public glowX = signal(0);
  public glowY = signal(0);

  public currentTime = signal(new Date());

  // ==========================
  // CONSTRUCTOR
  // ==========================
public today = new Date();
  constructor() {

    setInterval(() => {
      this.currentTime.set(new Date());
    }, 1000);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {

        if (window.innerWidth < 1024) {
          this.isSidebarOpen.set(false);
        }

      });

  }

  // ==========================
  // MOUSE TRACKING
  // ==========================

  @HostListener('mousemove', ['$event'])
  mouseMove(event: MouseEvent): void {

    this.mouseX.set(event.clientX);
    this.mouseY.set(event.clientY);

    this.glowX.set(event.clientX);
    this.glowY.set(event.clientY);

  }

  // ==========================
  // WINDOW RESIZE
  // ==========================

  @HostListener('window:resize')
  resize(): void {

    if (window.innerWidth >= 1024) {
      this.isSidebarOpen.set(false);
    }

  }
  

  // ==========================
  // EXISTING METHODS
  // ==========================

  toggleSidebar(): void {

    this.isSidebarOpen.update(value => !value);

  }

  logout(): void {

    localStorage.clear();

    this.router.navigate(['/login']);

  }

}