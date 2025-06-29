import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Publicacion } from '../publicaciones/publicaciones/entities/publicacion.entity';
import { Comentario } from '../publicaciones/comentarios/entities/comentario.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class EstadisticasService {
  constructor(
    @InjectModel(Publicacion.name)
    private publicacionModel: Model<Publicacion>,
    @InjectModel(Comentario.name)
    private comentarioModel: Model<Comentario>,
    @InjectModel(Usuario.name)
    private usuarioModel: Model<Usuario>,
  ) {}

  async publicacionesPorUsuario(
    usuarioId: Types.ObjectId,
    desde: number,
    hasta: number,
  ) {
    const match = { $match: { _id: usuarioId } };

    const buscarPublicaciones = {
      $lookup: {
        from: 'publicaciones',
        localField: '_id',
        foreignField: 'usuarioId',
        as: 'publicaciones',
        pipeline: [
          {
            $match: {
              $and: [{ fecha: { $gte: desde } }, { fecha: { $lte: hasta } }],
            },
          },
        ],
      },
    };

    const seleccionarCampos = {
      $project: {
        _id: 1,
        nombre: 1,
        apellido: 1,
        username: 1,
        email: 1,
        publicaciones: {
          _id: 1,
          fecha: 1,
        },
      },
    };

    const agregacion = [match, buscarPublicaciones, seleccionarCampos];

    const datos = await this.usuarioModel.aggregate(agregacion);
    return datos[0];
  }

  async comentarios(desde: number, hasta: number) {
    const filtro = {
      $and: [{ fecha: { $gte: desde } }, { fecha: { $lte: hasta } }],
    };

    const datos = await this.comentarioModel.find(filtro);
    return datos;
  }

  async comentariosPorPublicacion(
    publicacionId: Types.ObjectId,
    desde: number,
    hasta: number,
  ) {
    const match = { $match: { _id: publicacionId } };

    const buscarComentarios = {
      $lookup: {
        from: 'comentarios',
        localField: '_id',
        foreignField: 'publicacionId',
        as: 'comentarios',
        pipeline: [
          {
            $match: {
              $and: [{ fecha: { $gte: desde } }, { fecha: { $lte: hasta } }],
            },
          },
        ],
      },
    };

    const seleccionarCampos = {
      $project: {
        _id: 1,
        titulo: 1,
        contenido: 1,
        fecha: 1,
        comentarios: {
          _id: 1,
          fecha: 1,
        },
      },
    };

    const agregacion = [match, buscarComentarios, seleccionarCampos];

    const datos = await this.publicacionModel.aggregate(agregacion);

    return datos[0];
  }
}
