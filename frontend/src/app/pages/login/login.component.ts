import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  formulario: FormGroup;
  router = inject(Router);

  constructor() {
    this.formulario = new FormGroup({
      email: new FormControl('', [Validators.required]),
      pass: new FormControl('', [Validators.required]),
    });
  }

  async iniciarSesion() {
    const email = this.formulario.value.email.trim();
    const pass = this.formulario.value.pass;

    if (!this.formulario.valid) {
      Swal.fire({
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

    // const exito = await this.db.iniciarSesion(email, pass);
    const exito = false;
    if (!exito) {
      Swal.fire({
        icon: 'error',
        title: 'Error...',
        text: 'El nombre de usuario o la contraseña son incorrectas',
        theme: 'dark',
        width: '50rem',
        customClass: {
          title: 'modal-titulo',
          htmlContainer: 'modal-texto',
          icon: 'modal-icono',
          confirmButton: 'modal-boton',
        },
      });
      return;
    }
    this.router.navigateByUrl('/');
  }
}
