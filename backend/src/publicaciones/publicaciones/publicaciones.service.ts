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
    const instancia = new this.publicacionModel(publicacionDto);
    const guardado = await instancia.save();

    return guardado;
  }

  async findAll() {
    const publicaciones = await this.publicacionModel.aggregate([
      { $match: { eliminado: false } },
      {
        $addFields: {
          usuarioObjectId: { $toObjectId: '$usuarioId' },
        },
      },
      {
        $lookup: {
          from: 'usuarios',
          localField: 'usuarioObjectId',
          foreignField: '_id',
          as: 'usuario',
        },
      },
      { $unwind: '$usuario' },
      {
        $project: {
          usuarioObjectId: 0,
          usuarioId: 0,
          eliminado: 0,
          __v: 0,
          usuario: {
            _id: 0,
            email: 0,
            username: 0,
            password: 0,
            createdAt: 0,
            descripcion: 0,
            eliminado: 0,
            __v: 0,
          },
        },
      },
    ]);
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
}
