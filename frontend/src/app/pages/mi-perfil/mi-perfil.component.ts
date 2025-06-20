import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../services/auth.service';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Publicacion } from '../../interfaces/publicacion';
import { PublicacionesService } from '../../services/publicaciones.service';
import { PublicacionComponent } from '../../components/publicacion/publicacion.component';

@Component({
  selector: 'app-mi-perfil',
  imports: [HeaderComponent, PublicacionComponent, TitleCasePipe, DatePipe],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css',
})
export class MiPerfilComponent implements OnInit {
  authService = inject(AuthService);
  publicacionesService = inject(PublicacionesService);
  usuario: any;
  publicaciones: Publicacion[];

  constructor() {
    this.publicaciones = [];
    this.usuario = this.authService.usuario;
    if (this.usuario.descripcoin === undefined) {
      this.usuario.descripcion = 'Aún no hay nada escrito.';
    }
  }

  async ngOnInit() {
    const publicacionesTraidas =
      await this.publicacionesService.traerPublicaciones(
        0,
        3,
        this.usuario._id,
      );
    for (const publicacion of publicacionesTraidas) {
      this.publicaciones.push(publicacion);
    }
  }
}
