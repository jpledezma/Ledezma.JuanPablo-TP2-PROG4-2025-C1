import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  imports: [HeaderComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.css',
})
export class UsuariosComponent {
  formulario: FormGroup;
  router = inject(Router);
  authService = inject(AuthService);

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

    // crear usuario
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

    const exito: any = await this.authService.registrar(formData);

    if (exito) {
      Swal.fire({
        icon: 'success',
        text: 'Se creó el usuario',
        theme: 'dark',
        width: '50rem',
        customClass: {
          htmlContainer: 'modal-texto',
          confirmButton: 'modal-boton',
        },
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo crear el usuario',
        theme: 'dark',
        width: '50rem',
        customClass: {
          htmlContainer: 'modal-texto',
          confirmButton: 'modal-boton',
        },
      });
    }
  }
}
