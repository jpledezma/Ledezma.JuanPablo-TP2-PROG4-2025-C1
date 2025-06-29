import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';
import { EstadisticasService } from './estadisticas.service';
import { LogueadoGuard } from '../guards/logueado/logueado.guard';
import { AdminGuard } from '../guards/admin/admin.guard';

@UseGuards(AdminGuard)
@UseGuards(LogueadoGuard)
@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('/publicaciones-usuario')
  async buscarPublicacionesPorUsuario(
    @Query('fecha_desde') fechaDesde: number,
    @Query('fecha_hasta') fechaHasta: number,
    @Query('user_id') usuarioId: string,
  ) {
    if (
      !isValidObjectId(usuarioId) ||
      isNaN(+fechaDesde) ||
      isNaN(+fechaHasta)
    ) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    const id = new ObjectId(usuarioId);
    const data = await this.estadisticasService.publicacionesPorUsuario(
      id,
      +fechaDesde,
      +fechaHasta,
    );

    if (!data) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return { payload: data };
  }

  @Get('/comentarios')
  async buscarComentarios(
    @Query('fecha_desde') fechaDesde: number,
    @Query('fecha_hasta') fechaHasta: number,
  ) {
    if (isNaN(+fechaDesde) || isNaN(+fechaHasta)) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    const data = await this.estadisticasService.comentarios(
      +fechaDesde,
      +fechaHasta,
    );

    if (!data) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    return { payload: data };
  }

  @Get('/comentarios-publicacion')
  async buscarComentariosPorPublicacion(
    @Query('fecha_desde') fechaDesde: number,
    @Query('fecha_hasta') fechaHasta: number,
    @Query('publicacion_id') publicacionId: string,
  ) {
    if (
      !isValidObjectId(publicacionId) ||
      isNaN(+fechaDesde) ||
      isNaN(+fechaHasta)
    ) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    const id = new ObjectId(publicacionId);
    const data = await this.estadisticasService.comentariosPorPublicacion(
      id,
      +fechaDesde,
      +fechaHasta,
    );

    if (!data) {
      throw new HttpException(
        'Publicacion no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }

    return { payload: data };
  }
}
