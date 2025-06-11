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
    const usuario = {
      nombre: 'Isaac',
      apellido: 'Newton',
      urlFotoPerfil: '',
      urlFotoThumbnail:
        'https://avatars.githubusercontent.com/u/75924747?s=40&v=4',
    };
    const ejemplo = {
      id: '',
      usuario: usuario,
      titulo: 'Titulo',
      contenido:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloribus soluta magnam qui recusandae voluptatem consequatur blanditiis? Alias distinctio at odio!',
      fecha: Date.now(),
      likes: 0,
      dislikes: 0,
      urlImagen:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwallpapercave.com%2Fwp%2Fwp4324870.jpg&f=1&nofb=1&ipt=cfe21230dc1bd411852bce47538462dfd1c47d79fb84ed521ac74a95d87bab4e',
    };
    this.publicaciones.push(ejemplo);
    this.publicaciones.push(ejemplo);
  }
}
