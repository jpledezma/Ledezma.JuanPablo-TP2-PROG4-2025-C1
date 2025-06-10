import { Component, input, InputSignal } from '@angular/core';
import { Comentario } from '../../interfaces/comentario';
import { Publicacion } from '../../interfaces/publicacion';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-publicacion',
  imports: [DatePipe],
  templateUrl: './publicacion.component.html',
  styleUrl: './publicacion.component.css',
})
export class PublicacionComponent {
  publicacion: InputSignal<Publicacion | undefined> = input();
  comentarios?: Comentario[];
  comentariosVisibles: boolean = false;

  async mostrarComentarios() {
    if (this.comentarios === undefined) {
      // buscar en la db los comentarios
      const comentarios: Comentario[] = [
        {
          fecha: Date.now(),
          nombreUsuario: 'Pepito66',
          urlThumbnail:
            'https://avatars.githubusercontent.com/u/75924747?s=40&v=4',
        },
      ];

      this.comentarios = [];
      for (const comentario of comentarios) {
        this.comentarios.push(comentario);
      }
    }
  }
}
