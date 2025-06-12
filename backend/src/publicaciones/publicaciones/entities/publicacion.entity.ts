export class Publicacion {
  idUsuario: string;
  fecha: number; // timestamp
  titulo: string;
  contenido: string;
  urlImagen?: string;
  likes: string[]; // lista de id de usuarios
  dislikes: string[]; // lista de id de usuarios
  // los comentarios estan en otra coleccion
}
