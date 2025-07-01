import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { Comentario } from './entities/comentario.entity';

@Injectable()
export class ComentariosService {
  constructor(
    @InjectModel(Comentario.name)
    private comentarioModel: Model<Comentario>,
  ) {}

  async create(
    publicacionId: Types.ObjectId,
    usuarioId: Types.ObjectId,
    contenido: string,
  ) {
    const instancia = new this.comentarioModel({
      publicacionId,
      usuarioId,
      contenido,
      fecha: Date.now(),
    });

    const guardado = await instancia.save();

    return guardado;
  }

  async findAll(publicacionId: string) {
    const agregacion: any[] = [];

    const match: any = {
      $match: {
        eliminado: false,
        publicacionId: new Types.ObjectId(publicacionId),
      },
    };

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

    const seleccionarCampos = {
      $project: {
        _id: 1,
        fecha: 1,
        contenido: 1,
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
      $sort: { fecha: 1 },
    };

    agregacion.push(
      match,
      buscarDatosUsuario,
      obtenerUsuario,
      seleccionarCampos,
      ordernar,
    );

    const comentarios = await this.comentarioModel.aggregate(agregacion);

    return comentarios;
  }

  async findOne(id: string) {
    const comentario = await this.comentarioModel.findById(id);
    return comentario;
  }

  async update(
    id: Types.ObjectId,
    comentario: UpdateComentarioDto,
    usuarioId: Types.ObjectId,
  ) {
    const actualizado = await this.comentarioModel.updateOne(
      { _id: id, usuarioId: usuarioId },
      comentario,
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
    const eliminado = await this.comentarioModel.updateOne(filtro, {
      eliminado: true,
    });
    return eliminado;
  }
}
