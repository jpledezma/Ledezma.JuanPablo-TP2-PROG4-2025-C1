import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicacionesService } from '../../services/publicaciones.service';
import { Publicacion } from '../../interfaces/publicacion';
import { DatePipe, NgStyle, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Comentario } from '../../interfaces/comentario';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-publicacion-individual',
  imports: [HeaderComponent, TitleCasePipe, DatePipe, NgStyle, FormsModule],
  templateUrl: './publicacion-individual.component.html',
  styleUrl: './publicacion-individual.component.css',
})
export class PublicacionIndividualComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  publicacionesService = inject(PublicacionesService);
  authService = inject(AuthService);

  publicacion?: Publicacion;
  comentarios?: Comentario[];
  liked: boolean = false;
  disliked: boolean = false;
  comentariosVisibles: boolean = false;
  mensaje: string = '';

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.publicacionesService.traerPublicacion(id).then((publicacion) => {
        if (!publicacion) {
          this.router.navigateByUrl('/404');
        } else {
          this.publicacion = publicacion;
          this.comprobarLikes();
        }
      });
    });
  }

  comprobarLikes() {
    const usuarioId = this.authService.usuario._id;
    if (this.publicacion?.likes.includes(usuarioId)) {
      this.liked = true;
      this.disliked = false;
    } else if (this.publicacion?.dislikes.includes(usuarioId)) {
      this.liked = false;
      this.disliked = true;
    }
  }

  darLike() {
    const usuarioId = this.authService.usuario._id;
    this.publicacionesService.interactuar(
      this.publicacion!._id,
      this.authService.usuario._id,
      'like',
    );
    if (this.liked) {
      this.publicacion!.likes.pop();
      this.liked = false;
    } else {
      this.publicacion!.likes.push(usuarioId);
      this.liked = true;
      this.disliked = false;
      if (this.publicacion?.dislikes.includes(usuarioId)) {
        const index = this.publicacion?.dislikes.indexOf(usuarioId);
        this.publicacion?.dislikes.splice(index!, 1);
      }
    }
  }

  darDislike() {
    const usuarioId = this.authService.usuario._id;
    this.publicacionesService.interactuar(
      this.publicacion!._id,
      this.authService.usuario._id,
      'dislike',
    );
    if (this.disliked) {
      this.publicacion!.dislikes.pop();
      this.disliked = false;
    } else {
      this.publicacion!.dislikes.push(usuarioId);
      this.disliked = true;
      this.liked = false;
      if (this.publicacion?.likes.includes(usuarioId)) {
        const index = this.publicacion?.likes.indexOf(usuarioId);
        this.publicacion?.likes.splice(index!, 1);
      }
    }
  }

  async mostrarComentarios() {
    this.comentariosVisibles = !this.comentariosVisibles;

    if (this.comentarios === undefined) {
      this.comentarios = [];
      const comentarios = await this.publicacionesService.traerComentarios(
        this.publicacion!._id,
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
      publicacionId: this.publicacion!._id,
      contenido: this.mensaje,
    };

    const resultado = await this.publicacionesService.enviarComentario(
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

    const exito = await this.publicacionesService.eliminarPublicacion(
      this.publicacion?._id!,
    );

    if (exito) {
      this.mostrarMensajeExito('publicacion', 'eliminó');
      this.router.navigateByUrl('/');
    } else {
      this.mostrarMensajeError('publicacion', 'eliminar');
    }
  }

  async eliminarComentario(comentario: Comentario, index: number) {
    const confirmado = await this.mostrarMensajePreguntaEliminar('comentario');
    if (!confirmado) {
      return;
    }
    const exito = await this.publicacionesService.eliminarComentario(
      comentario._id,
    );

    if (exito) {
      this.mostrarMensajeExito('comentario', 'eliminó');
      this.comentarios?.splice(index, 1);
    } else {
      this.mostrarMensajeError('comentario', 'eliminar');
    }
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
