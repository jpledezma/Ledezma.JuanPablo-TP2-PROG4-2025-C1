import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EstadisticasService {
  httpClient = inject(HttpClient);
  url: string;

  constructor() {
    this.url = environment.url + 'estadisticas';
  }

  async traerPublicacionesPorUsuario(
    usuarioId: string,
    desde: number,
    hasta: number,
  ) {
    let urlPeticion = `${this.url}/publicaciones-usuario?`;
    urlPeticion += `user_id=${usuarioId}&`;
    urlPeticion += `fecha_desde=${desde}&`;
    urlPeticion += `fecha_hasta=${hasta}`;

    const peticion = this.httpClient.get(urlPeticion);

    try {
      const respuesta: any = await firstValueFrom(peticion);

      return respuesta.payload;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async traercomentarios(desde: number, hasta: number) {
    let urlPeticion = `${this.url}/comentarios?`;
    urlPeticion += `fecha_desde=${desde}&`;
    urlPeticion += `fecha_hasta=${hasta}`;

    const peticion = this.httpClient.get(urlPeticion);

    try {
      const respuesta: any = await firstValueFrom(peticion);

      return respuesta.payload;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async traercomentariosPorPublicacion(
    publicacionId: string,
    desde: number,
    hasta: number,
  ) {
    let urlPeticion = `${this.url}/comentarios-publicacion?`;
    urlPeticion += `publicacion_id=${publicacionId}&`;
    urlPeticion += `fecha_desde=${desde}&`;
    urlPeticion += `fecha_hasta=${hasta}`;

    const peticion = this.httpClient.get(urlPeticion);

    try {
      const respuesta: any = await firstValueFrom(peticion);

      return respuesta.payload;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
