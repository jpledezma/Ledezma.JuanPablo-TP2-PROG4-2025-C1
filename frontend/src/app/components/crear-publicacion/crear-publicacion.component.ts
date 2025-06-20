import {
  Component,
  inject,
  input,
  InputSignal,
  OnDestroy,
  OnInit,
  output,
} from '@angular/core';
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
export class CrearPublicacionComponent implements OnDestroy, OnInit {
  cerrarForm = output<Publicacion | null>();
  publicacionModificada: InputSignal<Publicacion | undefined> = input();
  service = inject(PublicacionesService);
  auth = inject(AuthService);
  formulario: FormGroup;
  imagen?: File;
  enEspera = false;

  constructor() {
    this.formulario = new FormGroup({
      titulo: new FormControl('', [Validators.required]),
      contenido: new FormControl('', [Validators.required]),
      imagen: new FormControl(''),
    });

    // bloquear scroll
    document.body.style.overflow = 'hidden';
  }

  ngOnInit(): void {
    if (this.publicacionModificada()) {
      this.formulario.controls['contenido'].setValue(
        this.publicacionModificada()!.contenido,
      );

      this.formulario.controls['titulo'].setValue(
        this.publicacionModificada()!.titulo,
      );
    }
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
    if (
      this.formulario.value.titulo.trim() == '' ||
      this.formulario.value.contenido.trim() == ''
    ) {
      Swal.fire({
        icon: 'error',
        text: 'Debe completar todos los campos',
        theme: 'dark',
        width: '50rem',
        customClass: {
          htmlContainer: 'modal-texto',
          confirmButton: 'modal-boton',
        },
      });
      return;
    }

    if (this.publicacionModificada()) {
      this.guardarCambios();
      return;
    }

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

  async guardarCambios() {
    this.enEspera = true;

    const exito = await this.service.modificarPublicacion(
      this.publicacionModificada()?._id!,
      this.formulario.value.titulo.trim(),
      this.formulario.value.contenido.trim(),
    );

    this.enEspera = false;

    if (!exito) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo modificar tu publicación',
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
        text: 'Se modificó tu publicación',
        theme: 'dark',
        width: '50rem',
        customClass: {
          htmlContainer: 'modal-texto',
          confirmButton: 'modal-boton',
        },
      });

      this.publicacionModificada()!.titulo =
        this.formulario.value.titulo.trim();
      this.publicacionModificada()!.contenido =
        this.formulario.value.contenido.trim();

      this.cerrarForm.emit(this.publicacionModificada()!);
    }
  }
}
