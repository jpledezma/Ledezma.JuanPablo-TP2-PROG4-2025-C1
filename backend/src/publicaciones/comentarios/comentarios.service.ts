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

    const eliminarCamposInnecesarios = {
      $project: {
        usuarioObjectId: 0,
        usuarioId: 0,
        publicacionId: 0,
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

    const comentarios = await this.comentarioModel.aggregate(agregacion);

    return comentarios;
  }

  async findOne(id: string) {
    const comentario = await this.comentarioModel.findById(id);
    return comentario;
  }

  update(id: number, updateComentarioDto: UpdateComentarioDto) {
    return `This action updates a #${id} comentario`;
  }

  remove(id: number) {
    return `This action removes a #${id} comentario`;
  }
}
