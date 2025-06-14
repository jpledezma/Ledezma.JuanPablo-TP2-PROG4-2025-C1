import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  supabase: SupabaseClient<any, 'public', any>;
  bucket: string;
  constructor() {
    this.bucket = 'red-social/';
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_KEY!,
    );
  }

  async guardarImagen(
    buffer: any,
    nombre: string,
    extension: string,
    carpeta: 'publicaciones' | 'thumbnails' | 'fotos-perfil',
  ) {
    const { data, error } = await this.supabase.storage
      .from(this.bucket + carpeta)
      .upload(nombre, buffer, { contentType: `image/${extension}` });

    if (error) {
      console.log(error);
      return null;
    }

    return data;
  }

  obtenerUrl(
    path: any,
    carpeta: 'publicaciones' | 'thumbnails' | 'fotos-perfil',
  ) {
    const url = this.supabase.storage
      .from(this.bucket + carpeta)
      .getPublicUrl(path);
    return url;
  }
}
