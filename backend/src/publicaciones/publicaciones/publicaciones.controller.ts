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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  UseGuards,
  Query,
  Headers,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';
import { ObjectId } from 'mongodb';
import { isValidObjectId } from 'mongoose';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { LogueadoGuard } from '../../guards/logueado/logueado.guard';
import { ImagenesUtils } from '../../utils/utils/imagenes.utils';
import { AuthService } from '../../auth/auth.service';

@UseGuards(LogueadoGuard)
@Controller('publicaciones')
export class PublicacionesController {
  constructor(
    private readonly publicacionesService: PublicacionesService,
    private readonly imgUtils: ImagenesUtils,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('imagen'))
  async create(
    @Body()
    publicacion: CreatePublicacionDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        validators: [new MaxFileSizeValidator({ maxSize: 4_000_000 })],
      }),
    )
    imagen?: Express.Multer.File,
  ) {
    if (imagen) {
      const urls = await this.imgUtils.guardarImagen(imagen, 'publicaciones');
      publicacion.urlImagen = urls.urlImagen;
    }

    const pCreada = await this.publicacionesService.create(publicacion);

    return { payload: pCreada };
  }

  @Get()
  async findAll(
    @Query('offset') paramOffset: number,
    @Query('limit') paramLimit: number,
    @Query('user_id') paramUsuarioId: string,
  ) {
    let offset: number | undefined;
    let limit: number | undefined;
    let usuarioId: ObjectId | undefined;

    if (paramOffset !== undefined && paramLimit !== undefined) {
      if (isNaN(paramOffset) || isNaN(paramLimit)) {
        throw new HttpException(
          'offset y limit deben ser números',
          HttpStatus.BAD_REQUEST,
        );
      }
      offset = +paramOffset;
      limit = +paramLimit;
      if (limit > 100) {
        throw new HttpException(
          'limit debe ser menor o igual a 100',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    if (paramUsuarioId !== undefined) {
      if (!isValidObjectId(paramUsuarioId)) {
        throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
      } else {
        usuarioId = new ObjectId(paramUsuarioId);
      }
    }

    const publicaciones = await this.publicacionesService.findAll(
      offset,
      limit,
      usuarioId,
    );
    return { payload: publicaciones };
  }

  @Get('publicacion/:id')
  async findOne(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
    const objectId = new ObjectId(id);
    const resultado = await this.publicacionesService.findOne(objectId);

    if (resultado) {
      return { payload: resultado };
    } else {
      throw new HttpException(
        'No se encontró la publicación',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('publicacion/:id')
  async update(
    @Param('id') id: string,
    @Body() publicacionDto: UpdatePublicacionDto,
    @Headers() headers: any,
  ) {
    const token = headers.authorization.split(' ')[1];
    const decodificado: any = this.authService.leerToken(token);

    if (!isValidObjectId(decodificado.id) || !isValidObjectId(id)) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    const usuarioId = new ObjectId((decodificado as any).id);
    const publicacionId = new ObjectId(id);
    const resultado = await this.publicacionesService.update(
      publicacionId,
      publicacionDto,
      usuarioId,
    );

    if (resultado.matchedCount !== 0) {
      return { payload: { actualizado: true } };
    } else {
      throw new HttpException(
        'Publicacion no encontrada',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete('publicacion/:id')
  async remove(@Param('id') id: string, @Headers() headers: any) {
    const token = headers.authorization.split(' ')[1];
    const decodificado: any = this.authService.leerToken(token);

    if (!isValidObjectId(decodificado.id) || !isValidObjectId(id)) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    const usuarioId = new ObjectId((decodificado as any).id);
    const acceso = (decodificado as any).acceso;

    const publicacionId = new ObjectId(id);
    const resultado = await this.publicacionesService.remove(
      publicacionId,
      usuarioId,
      acceso === 'admin',
    );

    if (resultado.matchedCount !== 0) {
      return { payload: { deleted: true } };
    } else {
      throw new HttpException(
        'No se encontró la publicación',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Throttle({ default: { limit: 3, ttl: 2000 } })
  @Post('/like')
  async like(@Body() body: { publicacionId: string }, @Headers() headers: any) {
    const token = headers.authorization.split(' ')[1];
    const decodificado: any = this.authService.leerToken(token);

    if (
      !isValidObjectId(decodificado.id) ||
      !isValidObjectId(body.publicacionId)
    ) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    const usuarioId = new ObjectId(decodificado.id as string);
    const publicacionId = new ObjectId(body.publicacionId);
    await this.publicacionesService.darLike(usuarioId, publicacionId);
    return { payload: true };
  }

  @Throttle({ default: { limit: 3, ttl: 2000 } })
  @Post('/dislike')
  async dislike(
    @Body() body: { publicacionId: string },
    @Headers() headers: any,
  ) {
    const token = headers.authorization.split(' ')[1];
    const decodificado: any = this.authService.leerToken(token);

    if (
      !isValidObjectId(decodificado.id) ||
      !isValidObjectId(body.publicacionId)
    ) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    const usuarioId = new ObjectId(decodificado.id as string);
    const publicacionId = new ObjectId(body.publicacionId);
    await this.publicacionesService.darDislike(usuarioId, publicacionId);
    return { payload: true };
  }
}
