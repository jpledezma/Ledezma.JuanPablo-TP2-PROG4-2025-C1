import { Usuario } from './usuario';

export interface Publicacion {
  id: string;
  usuario: Usuario;
  fecha: number;
  titulo: string;
  contenido: string;
  likes: string[];
  dislikes: string[];
  urlImagen?: string;
}
