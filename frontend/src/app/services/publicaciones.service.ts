import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { Comentario } from '../interfaces/comentario';

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
    let respuesta: any;
    const peticion = this.httpClient.post(this.url, publicacion);
    try {
      respuesta = await firstValueFrom(peticion);
    } catch (error) {
      respuesta = null;
      console.log(error);
    }

    return respuesta;
  }

  interactuar(
    publicacionId: string,
    usuarioId: string,
    interaccion: 'like' | 'dislike',
  ) {
    const body = { publicacionId, usuarioId };
    const peticion = this.httpClient.post(`${this.url}/${interaccion}`, body);
    try {
      firstValueFrom(peticion);
    } catch (error) {
      console.log(error);
    }
  }

  async traerComentarios(publicacionId: string) {
    const peticion = this.httpClient.get(
      `${this.url}/comentarios/${publicacionId}`,
    );
    try {
      const respuesta = await firstValueFrom(peticion);
      return (respuesta as any).payload;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async enviarComentario(comentario: {
    usuarioId: string;
    publicacionId: string;
    contenido: string;
  }) {
    const peticion = this.httpClient.post(
      `${this.url}/comentarios`,
      comentario,
    );
    try {
      const respuesta = await firstValueFrom(peticion);
      return (respuesta as any).payload;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
