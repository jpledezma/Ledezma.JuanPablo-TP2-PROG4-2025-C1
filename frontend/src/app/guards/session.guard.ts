import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const sessionGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  await authService.comprobarToken();

  if (authService.logueado) {
    router.navigateByUrl('/inicio');
    return false;
  }

  return true;
};
