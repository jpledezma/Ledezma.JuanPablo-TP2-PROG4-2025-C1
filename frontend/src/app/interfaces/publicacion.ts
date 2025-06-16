import { Usuario } from './usuario';

export interface Publicacion {
  _id: string;
  usuario: Usuario;
  fecha: number;
  titulo: string;
  contenido: string;
  likes: string[];
  dislikes: string[];
  urlImagen?: string;
}
