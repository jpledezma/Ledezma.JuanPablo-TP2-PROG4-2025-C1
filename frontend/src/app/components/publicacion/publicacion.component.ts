import { Component, inject, input, InputSignal, OnInit } from '@angular/core';
import { Comentario } from '../../interfaces/comentario';
import { Publicacion } from '../../interfaces/publicacion';
import { DatePipe, NgStyle, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PublicacionesService } from '../../services/publicaciones.service';
import Swal from 'sweetalert2';
import { CrearPublicacionComponent } from '../crear-publicacion/crear-publicacion.component';

@Component({
  selector: 'app-publicacion',
  imports: [
    DatePipe,
    NgStyle,
    FormsModule,
    TitleCasePipe,
    CrearPublicacionComponent,
  ],
  templateUrl: './publicacion.component.html',
  styleUrl: './publicacion.component.css',
})
export class PublicacionComponent implements OnInit {
  publicacion: InputSignal<Publicacion | undefined> = input();
  comentarios?: Comentario[];
  comentariosVisibles: boolean = false;
  liked: boolean = false;
  disliked: boolean = false;
  mensaje: string = '';
  authService = inject(AuthService);
  publicacionService = inject(PublicacionesService);
  mostrarModificarPublicacion: boolean = false;

  ngOnInit(): void {
    const usuarioId = this.authService.usuario._id;
    if (this.publicacion()?.likes.includes(usuarioId)) {
      this.liked = true;
      this.disliked = false;
    } else if (this.publicacion()?.dislikes.includes(usuarioId)) {
      this.liked = false;
      this.disliked = true;
    }
  }

  darLike() {
    this.interactuar('like');
  }

  darDislike() {
    this.interactuar('dislike');
  }

  interactuar(accion: 'like' | 'dislike') {
    // todo este quilombo para no duplicar la funcion
    // no sé si valió la pena
    const usuarioId = this.authService.usuario._id;
    this.publicacionService.interactuar(
      this.publicacion()!._id,
      this.authService.usuario._id,
      accion,
    );

    let yaInteractuado: boolean;
    let interaccion: 'likes' | 'dislikes';
    let opuesto: 'likes' | 'dislikes';
    let cambioInteraccion: 'liked' | 'disliked';
    let cambioInteraccionOpuesto: 'liked' | 'disliked';
    if (accion === 'like') {
      yaInteractuado = this.liked;
      interaccion = 'likes';
      opuesto = 'dislikes';
      cambioInteraccion = 'liked';
      cambioInteraccionOpuesto = 'disliked';
    } else {
      yaInteractuado = this.disliked;
      interaccion = 'dislikes';
      opuesto = 'likes';
      cambioInteraccion = 'disliked';
      cambioInteraccionOpuesto = 'liked';
    }

    if (yaInteractuado) {
      this.publicacion()![interaccion].pop();
      this[cambioInteraccion] = false;
    } else {
      this.publicacion()![interaccion].push(usuarioId);
      this[cambioInteraccion] = true;
      this[cambioInteraccionOpuesto] = false;
      if (this.publicacion()![opuesto].includes(usuarioId)) {
        const index = this.publicacion()![opuesto].indexOf(usuarioId);
        this.publicacion()![opuesto].splice(index!, 1);
      }
    }
  }

  async mostrarComentarios() {
    this.comentariosVisibles = !this.comentariosVisibles;

    if (this.comentarios === undefined) {
      this.comentarios = [];
      const comentarios = await this.publicacionService.traerComentarios(
        this.publicacion()!._id,
      );
      for (const comentario of comentarios) {
        this.comentarios.push(comentario);
      }
    }
  }

  async enviarComentario() {
    this.mensaje = this.mensaje.trim();
    if (this.mensaje === '') {
      return;
    }
    const comentarioCreado = {
      usuarioId: this.authService.usuario._id,
      publicacionId: this.publicacion()!._id,
      contenido: this.mensaje,
    };

    const resultado = await this.publicacionService.enviarComentario(
      comentarioCreado,
    );

    if (resultado) {
      this.comentarios?.unshift({
        ...resultado,
        usuario: this.authService.usuario,
      } as Comentario);
      this.mensaje = '';
    } else {
      Swal.fire({
        icon: 'error',
        text: 'No se pudo enviar el comentario',
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

  async eliminarPublicacion() {
    const exito = await this.publicacionService.eliminarPublicacion(
      this.publicacion()?._id!,
    );

    if (exito) {
      Swal.fire({
        icon: 'success',
        text: 'Se eliminó tu publicación',
        theme: 'dark',
        width: '50rem',
        customClass: {
          title: 'modal-titulo',
          htmlContainer: 'modal-texto',
          icon: 'modal-icono',
          confirmButton: 'modal-boton',
        },
      });
    } else {
      Swal.fire({
        icon: 'error',
        text: 'No se pudo eliminar la publicación',
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

  modificarPublicacion() {
    this.mostrarModificarPublicacion = true;
  }

  cerrarModificar(publicacionModificada: Publicacion | null) {
    if (publicacionModificada) {
      this.publicacion()!.contenido = publicacionModificada.contenido;
      this.publicacion()!.titulo = publicacionModificada.titulo;
    }
    this.mostrarModificarPublicacion = false;
  }
}

/*
darDislike() {
    const usuarioId = this.authService.usuario._id;
    this.publicacionService.interactuar(
      this.publicacion()!.id,
      this.authService.usuario._id,
      'dislike',
    );
    if (this.disliked) {
      this.publicacion()!.dislikes.pop();
      this.disliked = false;
    } else {
      this.publicacion()!.dislikes.push(usuarioId);
      this.disliked = true;
      this.liked = false;
      if (this.publicacion()?.likes.includes(usuarioId)) {
        const index = this.publicacion()?.likes.indexOf(usuarioId);
        this.publicacion()?.likes.splice(index!, 1);
      }
    }
  }
  */
