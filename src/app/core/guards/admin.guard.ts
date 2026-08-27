import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // Basic check: Ensure a token or active state exists.
  // Update this logic based on how you store your JWT (e.g., localStorage.getItem('access_token'))
  const isAuthenticated = !!localStorage.getItem('user_active'); 

  if (!isAuthenticated) {
    router.navigate(['/login']);
    return false;
  }
  
  return true;
};