import { Routes } from '@angular/router';
import { sessionGuard } from './guards/session.guard';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: 'registro',
    canActivate: [sessionGuard],
    loadComponent: () =>
      import('./pages/registro/registro.component').then(
        (modulo) => modulo.RegistroComponent,
      ),
  },
  {
    path: 'login',
    canActivate: [sessionGuard],
    loadComponent: () =>
      import('./pages/login/login.component').then(
        (modulo) => modulo.LoginComponent,
      ),
  },
  {
    path: 'inicio',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/publicaciones/publicaciones.component').then(
        (modulo) => modulo.PublicacionesComponent,
      ),
  },
  {
    path: 'mi-perfil',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/mi-perfil/mi-perfil.component').then(
        (modulo) => modulo.MiPerfilComponent,
      ),
  },
  {
    path: 'administracion',
    canActivate: [authGuard, adminGuard],
    children: [
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./pages/usuarios/usuarios.component').then(
            (modulo) => modulo.UsuariosComponent,
          ),
      },
    ],
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'inicio',
  },
];
