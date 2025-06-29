import { Component, inject, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from '../../services/usuarios.service';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

interface Usuario {
  _id: string;
  nombre: string;
  apellido: string;
  email: string;
  username: string;
  urlFotoPerfil: string;
  urlFotoThumbnail: string;
  createdAt: number;
  eliminado: boolean;
  descripcion?: string;
  acceso?: string;
}

@Component({
  selector: 'app-usuarios',
  imports: [HeaderComponent, FormsModule, ReactiveFormsModule, DatePipe],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent implements OnInit {
  formulario: FormGroup;
  router = inject(Router);
  usuariosService = inject(UsuariosService);
  usuarios?: Usuario[] | undefined;

  constructor() {
    this.formulario = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      fechaNacimiento: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      pass: new FormControl('', [Validators.required]),
      username: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[\S]{4,}$/),
      ]),
    });
  }

  async ngOnInit() {
    const usuarios = await this.usuariosService.obtenerUsuarios();
    if (usuarios) {
      this.usuarios = usuarios;
    } else {
      this.usuarios = [];
    }
  }

  ordenarTabla(atributo: keyof Usuario, invertido: boolean = false) {
    if (invertido) {
      this.usuarios?.sort((a: Usuario, b: Usuario) =>
        a[atributo]! < b[atributo]! ? 1 : -1,
      );
    } else {
      this.usuarios?.sort((a: Usuario, b: Usuario) =>
        a[atributo]! > b[atributo]! ? 1 : -1,
      );
    }
  }

  copiarIdUsuario(id: string) {
    navigator.clipboard.writeText(id);
  }

  async eliminarUsuario(id: string) {
    const respuesta = await this.mostrarMensajePregunta('eliminar');
    if (!respuesta) {
      return;
    }

    const exito = await this.usuariosService.eliminarUsuario(id);

    if (exito) {
      this.mostrarMensajeExito('elimino');
      const usuarioEliminado = this.usuarios?.find(
        (usuario) => usuario._id === id,
      );
      usuarioEliminado!.eliminado = true;
    } else {
      this.mostrarMensajeError('eliminar');
    }
  }

  async restaurarUsuario(id: string) {
    const respuesta = await this.mostrarMensajePregunta('restaurar');
    if (!respuesta) {
      return;
    }

    const exito = await this.usuariosService.restaurarUsuario(id);

    if (exito) {
      this.mostrarMensajeExito('restauro');
      const usuarioRestaurado = this.usuarios?.find(
        (usuario) => usuario._id === id,
      );
      usuarioRestaurado!.eliminado = false;
    } else {
      this.mostrarMensajeError('restaurar');
    }
  }

  async guardarUsuario() {
    if (!this.formulario.valid) {
      Swal.fire({
        text: 'Los campos están en formato inválido',
        theme: 'dark',
        width: '50rem',
        customClass: {
          htmlContainer: 'modal-texto',
          confirmButton: 'modal-boton',
        },
      });
      return;
    }

    const formData = new FormData();
    formData.append('nombre', this.formulario.value.nombre.trim());
    formData.append('apellido', this.formulario.value.apellido.trim());
    formData.append('email', this.formulario.value.email.trim());
    formData.append('username', this.formulario.value.username.trim());
    formData.append('password', this.formulario.value.pass.trim());
    formData.append(
      'fechaNacimiento',
      new Date(this.formulario.value.fechaNacimiento).getTime().toString(),
    );

    const exito = await this.usuariosService.crearUsuario(formData);

    if (exito) {
      this.mostrarMensajeExito('creo');
    } else {
      this.mostrarMensajeError('crear');
    }
  }

  async mostrarMensajePregunta(accion: 'eliminar' | 'restaurar') {
    const resultado = await Swal.fire({
      icon: 'question',
      text: `¿Seguro que quieres ${accion} al usuario?`,
      theme: 'dark',
      width: '50rem',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: accion,
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

  async mostrarMensajeExito(accion: 'elimino' | 'creo' | 'restauro') {
    Swal.fire({
      icon: 'success',
      text: `Se ${accion} el usuario`,
      theme: 'dark',
      width: '50rem',
      customClass: {
        htmlContainer: 'modal-texto',
        confirmButton: 'modal-boton',
      },
    });
  }

  async mostrarMensajeError(accion: 'eliminar' | 'crear' | 'restaurar') {
    Swal.fire({
      icon: 'success',
      text: `No se pudo ${accion} el usuario`,
      theme: 'dark',
      width: '50rem',
      customClass: {
        htmlContainer: 'modal-texto',
        confirmButton: 'modal-boton',
      },
    });
  }
}
