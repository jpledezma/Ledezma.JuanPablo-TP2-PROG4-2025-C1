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
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { LogueadoGuard } from '../../guards/logueado/logueado.guard';
import { AuthService } from '../../auth/auth.service';
import { ObjectId } from 'mongodb';

@UseGuards(LogueadoGuard)
@Controller('publicaciones/comentarios')
export class ComentariosController {
  constructor(
    private readonly comentariosService: ComentariosService,
    private readonly authSesrvice: AuthService,
  ) {}

  @Post()
  async create(@Body() comentarioDto: CreateComentarioDto) {
    const comentario = await this.comentariosService.create(comentarioDto);
    if (comentario === null) {
      throw new HttpException('Error de validacion', HttpStatus.BAD_REQUEST);
    }
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
    const decodificado = this.authSesrvice.leerToken(token);

    let resultado;

    try {
      const usuarioId = new ObjectId((decodificado as any).id as string);
      const comentarioId = new ObjectId(id);
      resultado = await this.comentariosService.update(
        comentarioId,
        comentarioDto,
        usuarioId,
      );
    } catch (error) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    if (resultado.matchedCount !== 0) {
      return { payload: { actualizado: true } };
    } else {
      throw new HttpException(
        'Publicacion no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete('comentario/:id')
  async remove(@Param('id') id: string, @Headers() headers: any) {
    let resultado;
    const token = headers.authorization.split(' ')[1];
    const decodificado = this.authSesrvice.leerToken(token);

    try {
      const usuarioId = new ObjectId((decodificado as any).id as string);
      const acceso = (decodificado as any).admin;
      const comentarioId = new ObjectId(id);
      resultado = await this.comentariosService.remove(
        comentarioId,
        usuarioId,
        acceso === 'admin',
      );
    } catch (error) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    if (resultado.matchedCount !== 0) {
      return { payload: { deleted: true } };
    } else {
      throw new HttpException(
        'No se encontró la publicación',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
