import { Component, input, InputSignal } from '@angular/core';
import { Comentario } from '../../interfaces/comentario';
import { Publicacion } from '../../interfaces/publicacion';
import { DatePipe, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-publicacion',
  imports: [DatePipe, NgStyle, FormsModule],
  templateUrl: './publicacion.component.html',
  styleUrl: './publicacion.component.css',
})
export class PublicacionComponent {
  publicacion: InputSignal<Publicacion | undefined> = input();
  comentarios?: Comentario[];
  comentariosVisibles: boolean = false;
  liked: boolean = false;
  disliked: boolean = false;
  mensaje: string = '';

  async darLike() {
    if (this.liked) {
      // await sacar like
      this.publicacion()!.likes--;
      this.liked = false;
    } else {
      // await dar like
      // recibo el numero de likes y dislikes del await
      this.publicacion()!.likes++;
      this.liked = true;
      this.disliked = false;
    }
  }

  async darDislike() {
    if (this.disliked) {
      // await sacar dislike
      this.publicacion()!.dislikes--;
      this.disliked = false;
    } else {
      // await dar dislike
      // recibo el numero de likes y dislikes del await
      this.publicacion()!.dislikes++;
      this.disliked = true;
      this.liked = false;
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
