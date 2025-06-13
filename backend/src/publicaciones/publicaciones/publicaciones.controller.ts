import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { ObjectId } from 'mongodb';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  async create(@Body() publicacion: CreatePublicacionDto) {
    const publicacionCreada =
      await this.publicacionesService.create(publicacion);
    return { payload: publicacionCreada };
  }

  @Get()
  async findAll() {
    const publicaciones = await this.publicacionesService.findAll();
    return { payload: publicaciones };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let resultado;
    try {
      const objectId = new ObjectId(id);
      resultado = await this.publicacionesService.findOne(objectId);
    } catch (error) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    if (resultado) {
      return resultado;
    } else {
      throw new HttpException(
        'No se encontró la publicación',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePublicacioneDto: UpdatePublicacionDto,
  ) {
    return this.publicacionesService.update(+id, updatePublicacioneDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let resultado;
    try {
      const objectId = new ObjectId(id);
      resultado = await this.publicacionesService.remove(objectId);
    } catch (error) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    if (resultado) {
      return { payload: resultado };
    } else {
      throw new HttpException(
        'No se encontró la publicación',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
