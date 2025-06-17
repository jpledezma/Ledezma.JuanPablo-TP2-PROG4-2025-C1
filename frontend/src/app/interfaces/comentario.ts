import { Usuario } from './usuario';

export interface Comentario {
  _id: string;
  fecha: number;
  contenido: string;
  usuario: Usuario;
}
