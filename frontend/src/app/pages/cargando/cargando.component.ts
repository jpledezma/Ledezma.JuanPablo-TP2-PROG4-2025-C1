import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cargando',
  imports: [],
  templateUrl: './cargando.component.html',
  styleUrl: './cargando.component.css',
})
export class CargandoComponent implements OnInit {
  router = inject(Router);
  authService = inject(AuthService);

  ngOnInit(): void {
    // tal vez se rompa si justo se alcanza el límite
    // de peticiones del server, pero es poco probable
    this.authService.comprobarToken().then(() => {
      if (this.authService.logueado) {
        this.router.navigateByUrl('/inicio');
      } else {
        this.router.navigateByUrl('/login');
      }
    });
  }
}
