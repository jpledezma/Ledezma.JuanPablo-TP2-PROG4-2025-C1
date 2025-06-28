import { Component, inject, input, InputSignal, OnInit } from '@angular/core';
import { Comentario } from '../../interfaces/comentario';
import { Publicacion } from '../../interfaces/publicacion';
import { DatePipe, NgStyle, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PublicacionesService } from '../../services/publicaciones.service';
import Swal from 'sweetalert2';
import { CrearPublicacionComponent } from '../crear-publicacion/crear-publicacion.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-publicacion',
  imports: [
    DatePipe,
    NgStyle,
    FormsModule,
    TitleCasePipe,
    CrearPublicacionComponent,
    RouterLink,
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
  mostrarModificarComentario: boolean = false;
  contenidoComentarioModificado = '';
  idComentarioModificado = '';
  indiceComentarioModificado?: number;

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
      this.mostrarMensajeError('comentario', 'enviar');
    }
  }

  async eliminarPublicacion() {
    const confirmado = await this.mostrarMensajePreguntaEliminar('publicacion');
    if (!confirmado) {
      return;
    }

    const exito = await this.publicacionService.eliminarPublicacion(
      this.publicacion()?._id!,
    );

    if (exito) {
      this.mostrarMensajeExito('publicacion', 'eliminó');
    } else {
      this.mostrarMensajeError('publicacion', 'eliminar');
    }
  }

  modificarPublicacion() {
    this.mostrarModificarPublicacion = true;
  }

  cerrarModificarPublicacion(publicacionModificada: Publicacion | null) {
    if (publicacionModificada) {
      this.publicacion()!.contenido = publicacionModificada.contenido;
      this.publicacion()!.titulo = publicacionModificada.titulo;
    }
    this.mostrarModificarPublicacion = false;
  }

  async eliminarComentario(comentario: Comentario, indice: number) {
    const confirmado = await this.mostrarMensajePreguntaEliminar('comentario');
    if (!confirmado) {
      return;
    }
    const exito = await this.publicacionService.eliminarComentario(
      comentario._id,
    );

    if (exito) {
      this.mostrarMensajeExito('comentario', 'eliminó');
      this.comentarios?.splice(indice, 1);
    } else {
      this.mostrarMensajeError('comentario', 'eliminar');
    }
  }

  abrirModificarComentario(comentario: Comentario) {
    this.indiceComentarioModificado = this.comentarios?.indexOf(comentario);
    this.idComentarioModificado = comentario._id;
    this.contenidoComentarioModificado = comentario.contenido;
    this.mostrarModificarComentario = true;
  }

  cerrarModificarComentario() {
    this.idComentarioModificado = '';
    this.mostrarModificarComentario = false;
  }

  async modificarComentario() {
    const exito = await this.publicacionService.modificarComentario(
      this.idComentarioModificado,
      this.contenidoComentarioModificado,
    );

    if (exito) {
      this.mostrarMensajeExito('comentario', 'modificó');
      this.comentarios![this.indiceComentarioModificado!].contenido =
        this.contenidoComentarioModificado;
    } else {
      this.mostrarMensajeError('comentario', 'modificar');
    }
    this.cerrarModificarComentario();
  }

  mostrarMensajeError(
    objetivo: 'publicacion' | 'comentario',
    accion: 'eliminar' | 'modificar' | 'enviar',
  ) {
    Swal.fire({
      icon: 'error',
      text: `No se pudo ${accion} tu ${objetivo}`,
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

  mostrarMensajeExito(
    objetivo: 'publicacion' | 'comentario',
    accion: 'eliminó' | 'modificó',
  ) {
    Swal.fire({
      icon: 'success',
      text: `Se ${accion} tu ${objetivo}`,
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

  async mostrarMensajePreguntaEliminar(objetivo: 'publicacion' | 'comentario') {
    const resultado = await Swal.fire({
      icon: 'question',
      text: `Seguro que quieres eliminar tu ${objetivo}`,
      theme: 'dark',
      width: '50rem',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: `Eliminar ${objetivo}`,
      customClass: {
        title: 'modal-titulo',
        htmlContainer: 'modal-texto',
        icon: 'modal-icono',
        confirmButton: 'modal-boton',
        cancelButton: 'modal-boton-cancelar',
      },
    });

    return resultado.isConfirmed;
  }
}
