import { HttpStatus, Injectable } from '@nestjs/common';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';

@Injectable()
export class PublicacionesService {
  publicaciones: any[] = [];

  create(publicacion: CreatePublicacionDto) {
    this.publicaciones.push(publicacion);
    return {
      message: 'Publicacion creada',
      payload: publicacion,
    };
  }

  findAll() {
    return {
      payload: this.publicaciones,
    };
  }

  findOne(id: number) {
    return {
      payload: this.publicaciones[id],
    };
  }

  update(id: number, publicacion: UpdatePublicacionDto) {
    return `This action updates a #${id} publicacion`;
  }

  remove(id: number) {
    return `This action removes a #${id} publicacion`;
  }
}
