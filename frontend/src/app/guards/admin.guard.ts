import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  await authService.comprobarToken();
  const acceso = authService.usuario.acceso;

  if (acceso === 'admin') {
    return true;
  }

  router.navigateByUrl('/');
  return false;
};
