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
}
