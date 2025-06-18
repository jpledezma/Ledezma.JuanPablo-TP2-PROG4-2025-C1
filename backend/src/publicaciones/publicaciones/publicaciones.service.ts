import { Injectable } from '@nestjs/common';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Publicacion } from './entities/publicacion.entity';
import { Model, Types } from 'mongoose';

@Injectable()
export class PublicacionesService {
  constructor(
    @InjectModel(Publicacion.name)
    private publicacionModel: Model<Publicacion>,
  ) {}

  async create(publicacionDto: CreatePublicacionDto) {
    const instancia = new this.publicacionModel({
      contenido: publicacionDto.contenido,
      titulo: publicacionDto.titulo,
      urlImagen: publicacionDto.urlImagen,
      usuarioId: new Types.ObjectId(publicacionDto.usuarioId),
      fecha: Date.now(),
    });
    const guardado = await instancia.save();

    return guardado;
  }

  async findAll(offset?: number, limit?: number, usuarioId?: string) {
    const agregacion: any[] = [];
    const match: any = { $match: { eliminado: false } };
    if (usuarioId) {
      match.$match.usuarioId = usuarioId;
    }

    const buscarDatosUsuario = {
      $lookup: {
        from: 'usuarios',
        localField: 'usuarioId',
        foreignField: '_id',
        as: 'usuario',
      },
    };

    const obtenerUsuario = { $unwind: '$usuario' };

    const eliminarCamposInnecesarios = {
      $project: {
        usuarioId: 0,
        eliminado: 0,
        __v: 0,
        usuario: {
          _id: 0,
          email: 0,
          password: 0,
          createdAt: 0,
          descripcion: 0,
          eliminado: 0,
          __v: 0,
        },
      },
    };

    agregacion.push(
      match,
      buscarDatosUsuario,
      obtenerUsuario,
      eliminarCamposInnecesarios,
    );

    if (offset !== undefined && limit !== undefined) {
      agregacion.push({ $skip: offset });
      agregacion.push({ $limit: limit });
    }

    const publicaciones = await this.publicacionModel.aggregate(agregacion);

    return publicaciones;
  }

  async findOne(id: Types.ObjectId) {
    const publicacion = await this.publicacionModel.findById(id);
    return publicacion;
  }

  async update(id: Types.ObjectId, publicacion: UpdatePublicacionDto) {
    const actualizado = await this.publicacionModel.updateOne(
      { _id: id },
      publicacion,
    );
    return actualizado;
  }

  async remove(id: Types.ObjectId) {
    const eliminado = await this.publicacionModel.updateOne(
      { _id: id },
      { eliminado: true },
    );
    return eliminado;
  }

  async darLike(usuarioId: string, publicacionId: string) {
    const liked = await this.comprobarLike(usuarioId, publicacionId);

    if (liked) {
      await this.publicacionModel.updateOne(
        { _id: new Types.ObjectId(publicacionId) },
        { $pull: { likes: new Types.ObjectId(usuarioId) } },
      );
    } else {
      await this.publicacionModel.updateOne(
        { _id: new Types.ObjectId(publicacionId) },
        {
          $push: { likes: new Types.ObjectId(usuarioId) },
          $pull: { dislikes: new Types.ObjectId(usuarioId) },
        },
      );
    }
  }

  async darDislike(usuarioId: string, publicacionId: string) {
    const disliked = await this.comprobarDislike(usuarioId, publicacionId);

    if (disliked) {
      await this.publicacionModel.updateOne(
        { _id: new Types.ObjectId(publicacionId) },
        { $pull: { dislikes: new Types.ObjectId(usuarioId) } },
      );
    } else {
      await this.publicacionModel.updateOne(
        { _id: new Types.ObjectId(publicacionId) },
        {
          $push: { dislikes: new Types.ObjectId(usuarioId) },
          $pull: { likes: new Types.ObjectId(usuarioId) },
        },
      );
    }
  }

  private async comprobarLike(usuarioId: string, publicacionId: string) {
    const encontrado = await this.publicacionModel.findOne({
      _id: new Types.ObjectId(publicacionId),
      likes: new Types.ObjectId(usuarioId),
    });

    return encontrado !== null;
  }

  private async comprobarDislike(usuarioId: string, publicacionId: string) {
    const encontrado = await this.publicacionModel.findOne({
      _id: new Types.ObjectId(publicacionId),
      dislikes: new Types.ObjectId(usuarioId),
    });

    return encontrado !== null;
  }
}
