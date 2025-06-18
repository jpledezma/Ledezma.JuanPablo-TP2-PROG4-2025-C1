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
import { FooterComponent } from '../../components/footer/footer.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  imports: [FormsModule, ReactiveFormsModule, RouterLink, FooterComponent],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
})
export class RegistroComponent {
  formulario: FormGroup;
  router = inject(Router);
  authService = inject(AuthService);
  foto: any;

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

  get username() {
    return this.formulario.value.usuario.trim();
  }

  get fechaNacimiento() {
    let timestamp = new Date(this.formulario.value.fechaNacimiento).getTime();
    return String(timestamp);
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

    // crear usuario
    const formData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('apellido', this.apellido);
    formData.append('email', this.email);
    formData.append('username', this.username);
    formData.append('password', this.pass);
    formData.append('fechaNacimiento', this.fechaNacimiento);
    if (this.foto) {
      formData.append('fotoPerfil', this.foto, this.foto.name);
    }

    const exito: any = await this.authService.registrar(formData);

    if (exito) {
      this.authService.iniciarTimerAviso();
      this.router.navigateByUrl('/inicio');
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

  seleccionarFoto(event: any) {
    this.foto = event.target.files[0];
  }
}
