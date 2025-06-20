import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { PublicacionComponent } from '../../components/publicacion/publicacion.component';
import { Publicacion } from '../../interfaces/publicacion';
import { CrearPublicacionComponent } from '../../components/crear-publicacion/crear-publicacion.component';
import { PublicacionesService } from '../../services/publicaciones.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-publicaciones',
  imports: [HeaderComponent, PublicacionComponent, CrearPublicacionComponent],
  templateUrl: './publicaciones.component.html',
  styleUrl: './publicaciones.component.css',
})
export class PublicacionesComponent implements OnInit {
  publicaciones: Publicacion[] = [];
  mostrarCrearPublicacion: boolean = false;
  service = inject(PublicacionesService);
  offset: number = 0;
  limit: number = 10;
  quedanPublicacionesPorTraer = true;

  async ngOnInit() {
    await this.traerPublicaciones();
    this.ordenarPublicaciones('fecha');
  }

  crearPublicacion() {
    this.mostrarCrearPublicacion = true;
  }

  cerrarCrearPublicacion(publicacionCreada: Publicacion | null) {
    if (publicacionCreada) {
      this.publicaciones.unshift(publicacionCreada);
    }
    this.mostrarCrearPublicacion = false;
  }

  async traerPublicaciones() {
    if (!this.quedanPublicacionesPorTraer) {
      return;
    }

    const publicacionesTraidas = await this.service.traerPublicaciones(
      this.offset,
      this.limit,
    );

    if (publicacionesTraidas === null) {
      this.quedanPublicacionesPorTraer = false;
      return;
    }

    for (const publicacion of publicacionesTraidas) {
      this.publicaciones.push(publicacion);
    }

    this.offset += publicacionesTraidas.length;

    if (publicacionesTraidas.length < this.limit) {
      this.quedanPublicacionesPorTraer = false;
    }

    if (publicacionesTraidas.length === 0) {
      Swal.fire({
        icon: 'info',
        text: 'No quedan publicaciones para mostrar',
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

  seleccionarOrdenamiento(event: Event) {
    let valor = (event.target as HTMLSelectElement).value;
    this.ordenarPublicaciones(valor as 'fecha' | 'likes' | 'dislikes');
  }

  ordenarPublicaciones(valor: 'fecha' | 'likes' | 'dislikes') {
    // descendente
    if (valor === 'fecha') {
      this.publicaciones.sort((a, b) => b[valor] - a[valor]);
    } else {
      this.publicaciones.sort((a, b) => b[valor].length - a[valor].length);
    }
  }

  volverArriba() {
    const container = document.querySelector('.container');
    container?.scroll({ top: 0 });
  }
}
