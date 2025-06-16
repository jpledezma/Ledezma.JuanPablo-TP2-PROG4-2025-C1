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
} from '@nestjs/common';
import { ComentariosService } from './comentarios.service';
import { CreateComentarioDto } from './dto/create-comentario.dto';
import { UpdateComentarioDto } from './dto/update-comentario.dto';
import { LogueadoGuard } from '../../guards/logueado/logueado.guard';

@UseGuards(LogueadoGuard)
@Controller('publicaciones/comentarios')
export class ComentariosController {
  constructor(private readonly comentariosService: ComentariosService) {}

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
  update(
    @Param('id') id: string,
    @Body() updateComentarioDto: UpdateComentarioDto,
  ) {
    return this.comentariosService.update(+id, updateComentarioDto);
  }

  @Delete('comentario/:id')
  remove(@Param('id') id: string) {
    return this.comentariosService.remove(+id);
  }
}
