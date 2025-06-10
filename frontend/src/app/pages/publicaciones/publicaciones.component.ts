import { Component, input, InputSignal } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { PublicacionComponent } from '../../components/publicacion/publicacion.component';
import { Publicacion } from '../../interfaces/publicacion';

@Component({
  selector: 'app-publicaciones',
  imports: [HeaderComponent, PublicacionComponent],
  templateUrl: './publicaciones.component.html',
  styleUrl: './publicaciones.component.css',
})
export class PublicacionesComponent {
  publicaciones: Publicacion[] = [];
  constructor() {
    this.publicaciones.push({
      titulo: 'Titulo',
      contenido:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus soluta magnam qui recusandae voluptatem consequatur blanditiis? Alias distinctio at odio!',
      fecha: Date.now(),
      likes: 0,
      dislikes: 0,
      urlImagen:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.hdwallpapers.in%2Fdownload%2Ffloating_island_2-HD.jpg&f=1&nofb=1&ipt=a9617adefbf394e70ac2b7d0ba5a16299962ddf0ee56ac86ef5be060d842b385',
    });
  }
}
