import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { Publicacion } from './entities/publicacion.entity';

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

  async findAll(
    offset?: number,
    limit?: number,
    usuarioId?: Types.ObjectId,
    publicacionId?: Types.ObjectId,
  ) {
    const agregacion: any[] = [];
    const match: any = { $match: { eliminado: false } };
    if (usuarioId) {
      match.$match.usuarioId = usuarioId;
    }

    if (publicacionId) {
      match.$match._id = publicacionId;
    }

    const buscarDatosUsuario = {
      $lookup: {
        from: 'usuarios',
        localField: 'usuarioId',
        foreignField: '_id',
        as: 'usuario',
        pipeline: [{ $match: { eliminado: false } }],
      },
    };

    const obtenerUsuario = {
      $unwind: {
        path: '$usuario',
        preserveNullAndEmptyArrays: true,
      },
    };

    const buscarComentarios = {
      $lookup: {
        from: 'comentarios',
        localField: '_id',
        foreignField: 'publicacionId',
        as: 'comentarios',
        pipeline: [{ $match: { eliminado: false } }],
      },
    };

    const agregarCantidadComentarios = {
      $addFields: {
        cantidadComentarios: { $size: '$comentarios' },
      },
    };

    const seleccionarCampos = {
      $project: {
        _id: 1,
        fecha: 1,
        titulo: 1,
        likes: 1,
        dislikes: 1,
        contenido: 1,
        urlImagen: 1,
        cantidadComentarios: 1,
        usuario: {
          nombre: 1,
          apellido: 1,
          username: 1,
          urlFotoPerfil: 1,
          urlFotoThumbnail: 1,
        },
      },
    };

    const ordernar = {
      $sort: { fecha: -1 },
    };

    agregacion.push(
      match,
      buscarComentarios,
      agregarCantidadComentarios,
      buscarDatosUsuario,
      obtenerUsuario,
      seleccionarCampos,
      ordernar,
    );

    if (offset !== undefined && limit !== undefined) {
      agregacion.push({ $skip: offset });
      agregacion.push({ $limit: limit });
    }

    const publicaciones = await this.publicacionModel.aggregate(agregacion);

    return publicaciones;
  }

  async findOne(id: Types.ObjectId) {
    const publicacion = (await this.findAll(0, 1, undefined, id))[0];
    return publicacion;
  }

  async update(
    id: Types.ObjectId,
    publicacion: UpdatePublicacionDto,
    usuarioId: Types.ObjectId,
  ) {
    const actualizado = await this.publicacionModel.updateOne(
      { _id: id, usuarioId: usuarioId },
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

// 1751233169953
// 1751230180176
// 1751230176949
// 1751230173884
// 1750452984622
// 1750381857962
// 1750367766110
// 1750275427944
// 1750274980710
// 1750271174076
// 1750261477127
// 1750174196571
