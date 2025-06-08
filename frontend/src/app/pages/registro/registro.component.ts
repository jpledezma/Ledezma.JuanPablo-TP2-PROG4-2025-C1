import { Component, inject } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
  ValidationErrors,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  formulario: FormGroup;
  router = inject(Router);

  constructor() {
    this.formulario = new FormGroup({
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      usuario: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[\S]{4,}$/),
      ]),
      fechaNacimiento: new FormControl('', [
        Validators.required,
        this.validarFecha,
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
      pass: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/),
      ]),
      passConfirm: new FormControl('', [Validators.required]),
      fotoPerfil: new FormControl(),
    });
  }

  get nombre() {
    return this.formulario.value.nombre.trim();
  }

  get apellido() {
    return this.formulario.value.apellido.trim();
  }

  get fechaNacimiento() {
    return this.formulario.value.fechaNacimiento;
  }

  get email() {
    return this.formulario.value.email.trim();
  }

  get pass() {
    return this.formulario.value.pass;
  }

  get passConfirm() {
    return this.formulario.value.passConfirm;
  }

  async guardarUsuario() {
    if (this.pass !== this.passConfirm) {
      return;
    }

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
    console.log('corrrect');

    // crear usuario
  }

  validarFecha(control: AbstractControl): ValidationErrors | null {
    const fechaIngresada = control.value;
    const formatoFecha = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;

    if (!formatoFecha.test(fechaIngresada)) {
      return { formatoInvalido: true };
    }

    let fechaActual = new Date();
    let fecha = new Date(fechaIngresada);
    let diferencia = fechaActual.getTime() - fecha.getTime();

    // Esto funciona a medias si la fecha es cercana a la actual
    if (diferencia < 0) {
      return { viajeroDelTiempo: true };
    }

    let edadAproximada = fechaActual.getFullYear() - fecha.getFullYear();

    if (edadAproximada > 120) {
      return { inmortal: true };
    }

    return null;
  }
}
