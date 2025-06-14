import { Injectable } from '@nestjs/common';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Publicacion } from './entities/publicacion.entity';
import { Model, Types } from 'mongoose';

//import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class PublicacionesService {
  // supabase: SupabaseClient<any, 'public', any>;
  // bucket: string;
  constructor(
    @InjectModel(Publicacion.name)
    private publicacionModel: Model<Publicacion>,
  ) {
    // this.bucket = 'red-social/';
    // this.supabase = createClient(
    //   process.env.SUPABASE_URL!,
    //   process.env.SUPABASE_KEY!,
    // );
  }

  async create(publicacionDto: CreatePublicacionDto) {
    const instancia = new this.publicacionModel(publicacionDto);
    const guardado = await instancia.save();

    return guardado;
  }

  async findAll() {
    const publicaciones = await this.publicacionModel.find({
      eliminado: { $eq: false },
    });
    return publicaciones;
  }

  async findOne(id: Types.ObjectId) {
    const publicacion = await this.publicacionModel.findById(id);
    return publicacion;
  }

  update(id: number, publicacion: UpdatePublicacionDto) {
    return `This action updates a #${id} publicacion`;
  }

  async remove(id: Types.ObjectId) {
    const eliminado = await this.publicacionModel.updateOne(
      { _id: id },
      { eliminado: true },
    );
    return eliminado;
  }

  // ----------------------------------------
  /*
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
  */
}
