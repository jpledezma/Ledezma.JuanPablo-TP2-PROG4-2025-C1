import { Component, inject, OnDestroy, output } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PublicacionesService } from '../../services/publicaciones.service';
import Swal from 'sweetalert2';
import { NgClass } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Publicacion } from '../../interfaces/publicacion';

@Component({
  selector: 'app-crear-publicacion',
  imports: [FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './crear-publicacion.component.html',
  styleUrl: './crear-publicacion.component.css',
})
export class CrearPublicacionComponent implements OnDestroy {
  cerrarForm = output<Publicacion | null>();
  service = inject(PublicacionesService);
  auth = inject(AuthService);
  formulario: FormGroup;
  imagen?: File;
  enEspera = false;

  constructor() {
    this.formulario = new FormGroup({
      titulo: new FormControl('', [Validators.required]),
      contenido: new FormControl('', [Validators.required]),
      imagen: new FormControl('', [Validators.required]),
    });

    // bloquear scroll
    document.body.style.overflow = 'hidden';
  }

  ngOnDestroy(): void {
    // desbloquear el scroll
    document.body.style.overflow = 'initial';
  }

  salir() {
    this.cerrarForm.emit(null);
  }

  seleccionarArchivo(event: any) {
    this.imagen = event.target.files[0];
  }

  cancelarImagen() {
    this.imagen = undefined;
  }

  async publicar() {
    const formData = new FormData();
    formData.append('usuarioId', this.auth.usuario._id);
    formData.append('titulo', this.formulario.value.titulo.trim());
    formData.append('contenido', this.formulario.value.contenido.trim());

    if (this.imagen) {
      formData.append('imagen', this.imagen, this.imagen.name);
    }

    this.enEspera = true;

    const respuesta = await this.service.crearPublicacion(formData);

    this.enEspera = false;

    if (respuesta === null) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo cargar tu publicación',
        theme: 'dark',
        width: '50rem',
        customClass: {
          htmlContainer: 'modal-texto',
          confirmButton: 'modal-boton',
        },
      });
    } else {
      Swal.fire({
        icon: 'success',
        text: 'Se cargó tu publicación',
        theme: 'dark',
        width: '50rem',
        customClass: {
          htmlContainer: 'modal-texto',
          confirmButton: 'modal-boton',
        },
      });
      const publicacionCreada = (respuesta as any)['payload'];
      publicacionCreada.usuario = {
        nombre: this.auth.usuario.nombre,
        apellido: this.auth.usuario.apellido,
        urlFotoPerfil: this.auth.usuario.urlFotoPerfil,
        urlFotoThumbnail: this.auth.usuario.urlFotoThumbnail,
      };
      this.cerrarForm.emit(publicacionCreada);
    }
  }
}
