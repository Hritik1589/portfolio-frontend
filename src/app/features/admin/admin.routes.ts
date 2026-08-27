import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layout/admin-layout.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    // 🚨 Security is already strictly handled in app.routes.ts!
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'projects',
        loadComponent: () => import('./projects/admin-projects.component').then(m => m.AdminProjectsComponent)
      },
      {
        path: 'blogs',
        loadComponent: () => import('./blogs/admin-blogs.component').then(m => m.AdminBlogsComponent)
      },    
      {
        path: 'about',
        loadComponent: () => import('./about/admin-about.component').then(m => m.AdminAboutComponent)
      },
      {
        path: 'messages',
        loadComponent: () => import('./messages/admin-messages.component').then(m => m.AdminMessagesComponent)
      },
      {
        path: 'certifications',
        loadComponent: () => import('./certifications/admin-certifications.component').then(m => m.AdminCertificationsComponent)
      },
      // 🚨 ADDED PHASE 21: Achievements Route
      {
        path: 'achievements',
        loadComponent: () => import('./achievements/admin-achievements.component').then(m => m.AdminAchievementsComponent)
      },
      // 🚨 ADDED PHASE 23: Education Route
      {
        path: 'education',
        loadComponent: () => import('./education/admin-education.component').then(m => m.AdminEducationComponent)
      },
      // 🚨 ADDED PHASE 25: Experiences Route
      {
        path: 'experiences',
        loadComponent: () => import('./experiences/admin-experiences.component').then(m => m.AdminExperiencesComponent)
      },
      // 🚨 ADDED PHASE 27: Skills Route
      {
        path: 'skills',
        loadComponent: () => import('./skills/admin-skills.component').then(m => m.AdminSkillsComponent)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  }
];