import { Routes } from '@angular/router';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  // ============================
  // Root Redirect -> Forces Login on Startup
  // ============================
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // ============================
  // Auth Routes
  // ============================
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'verify-otp',
    loadComponent: () => import('./features/auth/otp-verification/otp-verification.component').then(m => m.OtpVerificationComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/auth/password-recovery/password-recovery.component').then(m => m.PasswordRecoveryComponent)
  },

  // ============================
  // Public Portfolio Routes
  // ============================
  {
    path: 'about',
    loadComponent: () => import('./features/public/about/public-about.component').then(m => m.PublicAboutComponent)
  },
  {
    path: 'projects',
    loadComponent: () => import('./features/public/projects/public-projects.component').then(m => m.PublicProjectsComponent)
  },
  {
    path: 'projects/:slug',
    loadComponent: () => import('./features/public/projects/project-detail/project-detail.component').then(m => m.ProjectDetailComponent)
  },
  {
    path: 'blogs',
    loadComponent: () => import('./features/public/blogs/public-blogs.component').then(m => m.PublicBlogsComponent)
  },
  {
    path: 'blogs/:slug',
    loadComponent: () => import('./features/public/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/public/contact/public-contact.component').then(m => m.PublicContactComponent)
  },
  {
    path: 'certifications',
    loadComponent: () => import('./features/public/certifications/public-certifications.component').then(m => m.PublicCertificationsComponent)
  },
  {
    path: 'achievements',
    loadComponent: () => import('./features/public/achievements/public-achievements.component').then(m => m.PublicAchievementsComponent)
  },
  {
    path: 'education',
    loadComponent: () => import('./features/public/education/public-education.component').then(m => m.PublicEducationComponent)
  },
  {
    path: 'experience',
    loadComponent: () => import('./features/public/experience/public-experience.component').then(m => m.PublicExperienceComponent)
  },
  {
    path: 'skills',
    loadComponent: () => import('./features/public/skill/public-skill.component').then(m => m.PublicSkillComponent)
  },

  // ============================
  // Protected Routes (Admin)
  // ============================
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [roleGuard],
    data: { roles: ['ROLE_ADMIN'] }
  },

  // ============================
  // Protected Routes (Standard User)
  // ============================
  {
    path: 'user',
    loadComponent: () => import('./features/user/user-layout/user-layout.component').then(m => m.UserLayoutComponent),
    canActivate: [roleGuard],
    data: { roles: ['ROLE_USER'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/user/user-dashboard/user-dashboard.component').then(m => m.UserDashboardComponent)
      },
      {
        path: 'profile',
        loadComponent: () => import('./features/user/user-profile/user-profile.component').then(m => m.UserProfileComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./features/public/about/public-about.component').then(m => m.PublicAboutComponent)
      },
      {
        path: 'contact',
        loadComponent: () => import('./features/public/contact/public-contact.component').then(m => m.PublicContactComponent)
      },
      {
        path: 'projects',
        loadComponent: () => import('./features/public/projects/public-projects.component').then(m => m.PublicProjectsComponent)
      },
      {
        path: 'projects/:slug',
        loadComponent: () => import('./features/public/projects/project-detail/project-detail.component').then(m => m.ProjectDetailComponent)
      },
      {
        path: 'blogs',
        loadComponent: () => import('./features/public/blogs/public-blogs.component').then(m => m.PublicBlogsComponent)
      },
      {
        path: 'blogs/:slug',
        loadComponent: () => import('./features/public/blog-detail/blog-detail.component').then(m => m.BlogDetailComponent)
      },
      {
        path: 'certifications',
        loadComponent: () => import('./features/public/certifications/public-certifications.component').then(m => m.PublicCertificationsComponent)
      },
      {
        path: 'achievements',
        loadComponent: () => import('./features/public/achievements/public-achievements.component').then(m => m.PublicAchievementsComponent)
      },
      {
        path: 'education',
        loadComponent: () => import('./features/public/education/public-education.component').then(m => m.PublicEducationComponent)
      },
      {
        path: 'experience',
        loadComponent: () => import('./features/public/experience/public-experience.component').then(m => m.PublicExperienceComponent)
      },
      {
        path: 'skills',
        loadComponent: () => import('./features/public/skill/public-skill.component').then(m => m.PublicSkillComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // ============================
  // Fallback Route
  // ============================
  {
    path: '**',
    redirectTo: 'login'
  }
];