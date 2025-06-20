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

  async findAll(offset?: number, limit?: number, usuarioId?: Types.ObjectId) {
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

  async update(
    id: Types.ObjectId,
    publicacion: UpdatePublicacionDto,
    usuarioId: Types.ObjectId,
    esAdmin: boolean = false,
  ) {
    const filtro = { _id: id };
    if (!esAdmin) {
      filtro['usuarioId'] = usuarioId;
    }
    const actualizado = await this.publicacionModel.updateOne(
      filtro,
      publicacion,
    );
    return actualizado;
  }

  async remove(
    id: Types.ObjectId,
    usuarioId: Types.ObjectId,
    esAdmin: boolean = false,
  ) {
    const filtro = { _id: id };
    if (!esAdmin) {
      filtro['usuarioId'] = usuarioId;
    }
    const eliminado = await this.publicacionModel.updateOne(filtro, {
      eliminado: true,
    });
    return eliminado;
  }

  async darLike(usuarioId: Types.ObjectId, publicacionId: Types.ObjectId) {
    const liked = await this.comprobarLike(usuarioId, publicacionId);

    if (liked) {
      await this.publicacionModel.updateOne(
        { _id: publicacionId },
        { $pull: { likes: usuarioId } },
      );
    } else {
      await this.publicacionModel.updateOne(
        { _id: publicacionId },
        {
          $push: { likes: usuarioId },
          $pull: { dislikes: usuarioId },
        },
      );
    }
  }

  async darDislike(usuarioId: Types.ObjectId, publicacionId: Types.ObjectId) {
    const disliked = await this.comprobarDislike(usuarioId, publicacionId);

    if (disliked) {
      await this.publicacionModel.updateOne(
        { _id: publicacionId },
        { $pull: { dislikes: usuarioId } },
      );
    } else {
      await this.publicacionModel.updateOne(
        { _id: publicacionId },
        {
          $push: { dislikes: usuarioId },
          $pull: { likes: usuarioId },
        },
      );
    }
  }

  private async comprobarLike(
    usuarioId: Types.ObjectId,
    publicacionId: Types.ObjectId,
  ) {
    const encontrado = await this.publicacionModel.findOne({
      _id: publicacionId,
      likes: usuarioId,
    });

    return encontrado !== null;
  }

  private async comprobarDislike(
    usuarioId: Types.ObjectId,
    publicacionId: Types.ObjectId,
  ) {
    const encontrado = await this.publicacionModel.findOne({
      _id: publicacionId,
      dislikes: usuarioId,
    });

    return encontrado !== null;
  }
}
