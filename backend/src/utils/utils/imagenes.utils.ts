import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { SupabaseService } from '../../supabase/supabase.service';

@Injectable()
export class ImagenesUtils {
  constructor(private readonly supabaseService: SupabaseService) {}

  async guardarImagen(
    imagen: Express.Multer.File,
    carpeta: 'publicaciones' | 'fotos-perfil' | 'thumbnails',
    crearThumbnail: boolean = false,
  ): Promise<{ urlImagen: string; urlThumbail?: string }> {
    const nombreSeparado = imagen.originalname.split('.');
    const extension = nombreSeparado[nombreSeparado.length - 1];
    let hash = createHash('md5')
      .update(imagen.originalname)
      .digest('base64url');

    hash = hash.slice(0, 8); // con 8 caracteres me basta

    const nuevoNombre = `${Date.now()}.${hash}.${extension}`;
    imagen.originalname = nuevoNombre;

    const data = await this.supabaseService.guardarImagen(
      imagen.buffer,
      nuevoNombre,
      extension,
      carpeta,
    );

    if (crearThumbnail) {
      // generar un thumbanil
    }

    const url = this.supabaseService.obtenerUrl(data?.path, carpeta);

    const urlImagen = url.data.publicUrl;
    const urlThumbail = url.data.publicUrl;

    return { urlImagen, urlThumbail };
  }
}
