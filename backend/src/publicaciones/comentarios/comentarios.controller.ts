import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { isValidObjectId } from 'mongoose';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { LogueadoGuard } from '../../guards/logueado/logueado.guard';
import { AuthService } from '../../auth/auth.service';

@UseGuards(LogueadoGuard)
@Controller('publicaciones/comentarios')
export class ComentariosController {
  constructor(
    private readonly comentariosService: ComentariosService,
    private readonly authSesrvice: AuthService,
  ) {}

  @Post()
  async create(@Body() comentarioDto: CreateComentarioDto) {
    if (
      !isValidObjectId(comentarioDto.publicacionId) ||
      !isValidObjectId(comentarioDto.usuarioId)
    ) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    const comentario = await this.comentariosService.create(
      new ObjectId(comentarioDto.publicacionId),
      new ObjectId(comentarioDto.usuarioId),
      comentarioDto.contenido,
    );

    return { payload: comentario };
  }

  @Get(':publicacionId')
  async findAll(@Param('publicacionId') publicacionId: string) {
    const comentarios = await this.comentariosService.findAll(publicacionId);
    return { payload: comentarios };
  }

  @Get('comentario/:id')
  async findOne(@Param('id') id: string) {
    const comentario = await this.comentariosService.findOne(id);
    if (comentario) {
      return { payload: comentario };
    } else {
      throw new HttpException(
        'No se encontró el comentario',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('comentario/:id')
  async update(
    @Param('id') id: string,
    @Body() comentarioDto: UpdateComentarioDto,
    @Headers() headers: any,
  ) {
    const token = headers.authorization.split(' ')[1];
    const decodificado: any = this.authSesrvice.leerToken(token);
    if (!isValidObjectId(decodificado.id) || !isValidObjectId(id)) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    const usuarioId = new ObjectId(decodificado.id as string);
    const comentarioId = new ObjectId(id);
    const resultado = await this.comentariosService.update(
      comentarioId,
      comentarioDto,
      usuarioId,
    );

    if (resultado.matchedCount !== 0) {
      return { payload: { actualizado: true } };
    } else {
      throw new HttpException(
        'No se encontró el comentario',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete('comentario/:id')
  async remove(@Param('id') id: string, @Headers() headers: any) {
    const token = headers.authorization.split(' ')[1];
    const decodificado: any = this.authSesrvice.leerToken(token);
    if (!isValidObjectId(decodificado.id) || !isValidObjectId(id)) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    const usuarioId = new ObjectId(decodificado.id as string);
    const acceso = decodificado.admin;
    const comentarioId = new ObjectId(id);
    const resultado = await this.comentariosService.remove(
      comentarioId,
      usuarioId,
      acceso === 'admin',
    );

    if (resultado.matchedCount !== 0) {
      return { payload: { deleted: true } };
    } else {
      throw new HttpException(
        'No se encontró el comentario',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
