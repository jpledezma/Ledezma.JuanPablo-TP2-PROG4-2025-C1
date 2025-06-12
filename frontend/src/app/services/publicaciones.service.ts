import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PublicacionesService {
  httpClient = inject(HttpClient);
  url: string;
  publicaciones: any[];

  constructor() {
    this.url = environment.url + 'publicaciones';
    this.publicaciones = [];
  }

  async traerPublicaciones() {
    let data;
    const peticion = this.httpClient.get(this.url);

    try {
      const respuesta = await firstValueFrom(peticion);
      data = (respuesta as any).payload;
    } catch (error) {
      data = null;
      console.log(error);
    }

    return data;
  }

  async crearPublicacion(publicacion: any) {
    let respuesta;
    const peticion = this.httpClient.post(this.url, publicacion);
    try {
      respuesta = await firstValueFrom(peticion);
    } catch (error) {
      respuesta = null;
      console.log(error);
    }

    return respuesta;
  }
}
