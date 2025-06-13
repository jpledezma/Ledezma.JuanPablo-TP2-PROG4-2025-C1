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
}
