import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { AuthService } from '../../services/auth.service';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { Publicacion } from '../../interfaces/publicacion';
import { PublicacionesService } from '../../services/publicaciones.service';
import { PublicacionComponent } from '../../components/publicacion/publicacion.component';
import { UsuariosService } from '../../services/usuarios.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mi-perfil',
  imports: [
    HeaderComponent,
    PublicacionComponent,
    TitleCasePipe,
    DatePipe,
    FormsModule,
  ],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.css',
})
export class MiPerfilComponent implements OnInit {
  authService = inject(AuthService);
  usuarioService = inject(UsuariosService);
  publicacionesService = inject(PublicacionesService);
  usuario: any;
  publicaciones: Publicacion[];
  usuarioModificado?: any;
  mostrarModificarUsuario = false;

  constructor() {
    this.publicaciones = [];
    this.usuario = this.authService.usuario;
    if (this.usuario.descripcion === undefined) {
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

  modificarUsuario() {
    this.mostrarModificarUsuario = true;
    this.usuarioModificado = {
      nombre: this.usuario.nombre,
      apellido: this.usuario.apellido,
      descripcion: this.usuario.descripcion,
    };
  }

  cerrarModificarUsuario() {
    this.usuarioModificado = undefined;
    this.mostrarModificarUsuario = false;
  }

  async aplicarCambiosUsuario() {
    if (
      this.usuarioModificado.nombre.trim() === '' ||
      this.usuarioModificado.apellido.trim() === ''
    ) {
      this.mostrarMensajeError(
        'El nombre y el apellido no pueden estar vacíos',
      );
      return;
    }

    const exito = await this.usuarioService.modificarUsuario(
      this.usuarioModificado,
      this.usuario._id,
    );

    if (exito) {
      this.usuario.nombre = this.usuarioModificado.nombre;
      this.usuario.apellido = this.usuarioModificado.apellido;
      this.usuario.descripcion = this.usuarioModificado.descripcion;
      this.cerrarModificarUsuario();
      this.mostrarMensajeExito();
    } else {
      this.mostrarMensajeError('No se pudieron aplicar los cambios');
    }
  }

  mostrarMensajeExito() {
    Swal.fire({
      icon: 'success',
      text: `Se aplicaron los cambios`,
      theme: 'dark',
      width: '50rem',
      customClass: {
        title: 'modal-titulo',
        htmlContainer: 'modal-texto',
        icon: 'modal-icono',
        confirmButton: 'modal-boton',
      },
    });
  }

  mostrarMensajeError(mensaje: string) {
    Swal.fire({
      icon: 'error',
      text: mensaje,
      theme: 'dark',
      width: '50rem',
      customClass: {
        title: 'modal-titulo',
        htmlContainer: 'modal-texto',
        icon: 'modal-icono',
        confirmButton: 'modal-boton',
      },
    });
  }
}
