import { Component, inject, input, InputSignal, OnInit } from '@angular/core';
import { Comentario } from '../../interfaces/comentario';
import { Publicacion } from '../../interfaces/publicacion';
import { DatePipe, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PublicacionesService } from '../../services/publicaciones.service';

@Component({
  selector: 'app-publicacion',
  imports: [DatePipe, NgStyle, FormsModule],
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
      // buscar en la db los comentarios
      const comentarios: Comentario[] = [
        {
          fecha: Date.now(),
          nombreUsuario: 'Pepito66',
          urlThumbnail:
            'https://avatars.githubusercontent.com/u/75924747?s=40&v=4',
          mensaje:
            'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam vero eveniet debitis. Sit praesentium aspernatur sunt quis, ea nihil quibusdam totam, excepturi suscipit eaque rem nulla corporis. Ea, dolores fugiat.',
        },
      ];

      this.comentarios = [];
      for (const comentario of comentarios) {
        this.comentarios.push(comentario);
        this.comentarios.push(comentario);
      }
    }
  }

  async enviarComentario() {
    if (this.mensaje.trim() === '') {
      this.mensaje = '';
      return;
    }
    // await enviar comentario
    // recibo el comentario que envié
    this.comentarios!.push({
      fecha: Date.now(),
      nombreUsuario: 'Julio Cerar',
      urlThumbnail: 'https://avatars.githubusercontent.com/u/75924747?s=40&v=4',
      mensaje: this.mensaje,
    });

    this.mensaje = '';
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
