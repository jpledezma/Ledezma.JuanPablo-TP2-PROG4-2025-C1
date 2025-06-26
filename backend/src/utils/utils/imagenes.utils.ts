import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import * as sharp from 'sharp';
// import sharp from 'sharp'; esta no funciona, así que uso la de arriba
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
    const timestamp = Date.now();
    const nuevoNombre = `${timestamp}.${hash}.${extension}`;

    imagen.originalname = nuevoNombre;

    const data = await this.supabaseService.guardarImagen(
      imagen.buffer,
      nuevoNombre,
      extension,
      carpeta,
    );

    const url = this.supabaseService.obtenerUrl(data?.path, carpeta);
    const urlImagen = url.data.publicUrl;

    let urlThumbail: string;

    if (crearThumbnail) {
      const thumbnail = await sharp(imagen.buffer).resize(64, 64).toBuffer();
      const nombreThumbnail = `${timestamp}.${hash}.thumbnail.${extension}`;
      const data = await this.supabaseService.guardarImagen(
        thumbnail,
        nombreThumbnail,
        extension,
        'thumbnails',
      );

      const url = this.supabaseService.obtenerUrl(data?.path, 'thumbnails');
      urlThumbail = url.data.publicUrl;
    } else {
      urlThumbail = urlImagen;
    }

    return { urlImagen, urlThumbail };
  }
}
