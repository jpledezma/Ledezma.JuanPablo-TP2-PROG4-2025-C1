import { Injectable } from '@nestjs/common';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comentario } from './entities/comentario.entity';

@Injectable()
export class ComentariosService {
  constructor(
    @InjectModel(Comentario.name)
    private comentarioModel: Model<Comentario>,
  ) {}

  async create(comentarioDto: CreateComentarioDto) {
    try {
      let validarUsuario = new Types.ObjectId(comentarioDto.usuarioId);
      let validarpublicacion = new Types.ObjectId(comentarioDto.publicacionId);
    } catch (err) {
      console.log(err);
      return null;
    }
    const instancia = new this.comentarioModel({
      publicacionId: new Types.ObjectId(comentarioDto.publicacionId),
      usuarioId: new Types.ObjectId(comentarioDto.usuarioId),
      contenido: comentarioDto.contenido,
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
      },
    };

    const obtenerUsuario = { $unwind: '$usuario' };

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

    agregacion.push(
      match,
      buscarDatosUsuario,
      obtenerUsuario,
      seleccionarCampos,
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
