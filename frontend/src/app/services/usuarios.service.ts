import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {
  private httpClient = inject(HttpClient);
  private url: string;
  constructor() {
    this.url = environment.url + 'usuarios/';
  }

  async crearUsuario(usuario: any) {
    const url = environment.url + 'auth/registro';
    let exito;
    const peticion = this.httpClient.post(url, usuario);
    try {
      await firstValueFrom(peticion);
      exito = true;
    } catch (error) {
      exito = false;
      console.log(error);
    }

    return exito;
  }

  async modificarUsuario(modificaciones: any, id: string) {
    const url = this.url + id;
    const peticion = this.httpClient.patch(url, modificaciones);
    try {
      await firstValueFrom(peticion);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async eliminarUsuario(id: string) {
    const url = this.url + id;
    const peticion = this.httpClient.delete(url);
    try {
      await firstValueFrom(peticion);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async restaurarUsuario(id: string) {
    const url = this.url + 'restore';
    const peticion = this.httpClient.post(url, { id });
    try {
      await firstValueFrom(peticion);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async obtenerUsuarios() {
    const url = this.url;
    const peticion = this.httpClient.get(url);
    try {
      const respuesta: any = await firstValueFrom(peticion);

      return respuesta.payload;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
