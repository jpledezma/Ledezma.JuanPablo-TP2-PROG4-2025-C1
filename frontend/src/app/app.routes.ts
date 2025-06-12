import { Routes } from '@angular/router';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { PublicacionesComponent } from './pages/publicaciones/publicaciones.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';

export const routes: Routes = [
  {
    path: 'registro',
    component: RegistroComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'inicio',
    component: PublicacionesComponent,
  },
  {
    path: 'mi-perfil',
    component: MiPerfilComponent,
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
];
