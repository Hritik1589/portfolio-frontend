import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const roleGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // 1. Check if the user is logged in
  const userData = localStorage.getItem('user'); // Ensure your login saves this!
  if (!userData) {
    router.navigate(['/login']);
    return false;
  }

  // 2. Parse the user's roles
  const user = JSON.parse(userData);
  const userRoles: string[] = user.roles || [];
  
  // 3. Get the required roles for the route they are trying to visit
  const expectedRoles: string[] = route.data?.['roles'] || [];

  // 4. Verify if the user has the required role
  const hasRole = expectedRoles.some(role => userRoles.includes(role));

  if (!hasRole) {
    // If they don't have permission, send them to their correct dashboard
    if (userRoles.includes('ROLE_ADMIN')) {
      router.navigate(['/admin/dashboard']);
    } else {
      router.navigate(['/user/dashboard']);
    }
    return false;
  }

  return true; // Access granted!
};