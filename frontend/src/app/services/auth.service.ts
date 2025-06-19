import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private httpClient = inject(HttpClient);
  private url: string;
  private token: string | null;
  usuario?: any;
  logueado: boolean;
  private timerLogout?: any; //NodeJS.Timeout; no sé por qué no funciona...
  private timerAviso?: any; //NodeJS.Timeout;
  router = inject(Router);

  constructor() {
    this.url = environment.url + 'auth/';
    this.token = localStorage.getItem('jwt-token');
    this.logueado = false;
  }

  async loguear(username: string, password: string) {
    const peticion = this.httpClient.post(this.url + 'login', {
      username,
      password,
    });

    let exito;
    try {
      const respuesta = await firstValueFrom(peticion);
      this.token = (respuesta as any)['payload'] as string;
      localStorage.setItem('jwt-token', this.token);
      exito = true;
    } catch (error) {
      exito = false;
    }

    return exito;
  }

  async registrar(usuario: any) {
    let exito;
    const peticion = this.httpClient.post(`${this.url}registro`, usuario);
    try {
      const respuesta = await firstValueFrom(peticion);
      this.token = (respuesta as any)['payload'] as string;
      localStorage.setItem('jwt-token', this.token);
      exito = true;
    } catch (error) {
      exito = false;
      console.log(error);
    }

    return exito;
  }

  cerrarSesion() {
    localStorage.removeItem('jwt-token');
    this.token = null;
    this.logueado = false;
    this.usuario = undefined;
    clearTimeout(this.timerLogout);
    clearTimeout(this.timerAviso);
    this.router.navigateByUrl('/login');
  }

  async comprobarToken() {
    if (!this.token) {
      return;
    }

    const peticion = this.httpClient.get(this.url + 'validar');

    try {
      const respuesta = await firstValueFrom(peticion);
      if ((respuesta as any)['valido']) {
        this.logueado = true;
        // En serio typescript?
        let id = (respuesta as any)['id'] as string;
        await this.leerUsuario(id); // en realidad no hace falta el await, pero por las dudas
      }
    } catch (err) {
      console.log(err);
    }
  }

  async leerUsuario(id: string) {
    const peticion = this.httpClient.get(`${environment.url}usuarios/${id}`);
    try {
      const respuesta = await firstValueFrom(peticion);
      this.usuario = respuesta;
    } catch (err) {
      console.log(err);
      this.token = null;
      this.logueado = false;
      this.usuario = undefined;
    }
  }

  private async refrescarToken() {
    const peticion = this.httpClient.get(this.url + 'refresh-token');
    try {
      const respuesta = await firstValueFrom(peticion);
      this.token = (respuesta as any)['payload'] as string;
      localStorage.setItem('jwt-token', this.token);
    } catch (err) {
      console.log(err);
    }
  }

  private iniciarTimerLogout() {
    this.timerLogout = setTimeout(() => {
      this.cerrarSesion();
    }, 1000 * 60 * 1.5);
  }

  private reiniciarTimers() {
    this.refrescarToken();
    clearTimeout(this.timerLogout);
    clearTimeout(this.timerAviso);
    this.iniciarTimerAviso();
  }

  iniciarTimerAviso() {
    this.iniciarTimerLogout();
    this.timerAviso = setTimeout(() => {
      this.preguntarExtenderTiempo();
    }, 1000 * 60 * 1);
  }

  private preguntarExtenderTiempo() {
    Swal.fire({
      icon: 'warning',
      text: 'La sesión finalizará en 5 minutos. ¿Desea extender el tiempo?',
      theme: 'dark',
      width: '50rem',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Extender tiempo',
      timer: 1000 * 60 * 1.5,
      customClass: {
        title: 'modal-titulo',
        htmlContainer: 'modal-texto',
        icon: 'modal-icono',
        confirmButton: 'modal-boton',
        cancelButton: 'modal-boton-cancelar',
      },
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this.reiniciarTimers();
      }
    });
  }
}
