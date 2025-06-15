import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  httpClient = inject(HttpClient);
  url: string;
  token: string | null;
  usuario?: any;
  logueado: boolean;

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
        this.leerUsuario(id);
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
}
