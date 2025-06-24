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
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { ObjectId } from 'mongodb';
import { FileInterceptor } from '@nestjs/platform-express';
import { LogueadoGuard } from '../../guards/logueado/logueado.guard';
import { Throttle } from '@nestjs/throttler';
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
      try {
        usuarioId = new ObjectId(paramUsuarioId);
      } catch (error) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
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
    let resultado;
    try {
      const objectId = new ObjectId(id);
      resultado = await this.publicacionesService.findOne(objectId);
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

  @Patch('publicacion/:id')
  async update(
    @Param('id') id: string,
    @Body() publicacionDto: UpdatePublicacionDto,
    @Headers() headers: any,
  ) {
    let resultado;
    const token = headers.authorization.split(' ')[1];
    const decodificado = this.authService.leerToken(token);

    try {
      const usuarioId = new ObjectId((decodificado as any).id);
      const publicacionId = new ObjectId(id);
      resultado = await this.publicacionesService.update(
        publicacionId,
        publicacionDto,
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

  @Delete('publicacion/:id')
  async remove(@Param('id') id: string, @Headers() headers: any) {
    let resultado;
    const token = headers.authorization.split(' ')[1];
    const decodificado = this.authService.leerToken(token);

    try {
      const usuarioId = new ObjectId((decodificado as any).id);
      const acceso = (decodificado as any).admin;
      const publicacionId = new ObjectId(id);
      resultado = await this.publicacionesService.remove(
        publicacionId,
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

  @Throttle({ default: { limit: 3, ttl: 2000 } })
  @Post('/like')
  async like(@Body() body: { publicacionId: string }, @Headers() headers: any) {
    const token = headers.authorization.split(' ')[1];
    const decodificado = this.authService.leerToken(token);
    try {
      const usuarioId = new ObjectId((decodificado as any).id);
      const publicacionId = new ObjectId(body.publicacionId);
      await this.publicacionesService.darLike(usuarioId, publicacionId);
      return { payload: true };
    } catch (err) {
      console.log(err);
    }
  }

  @Throttle({ default: { limit: 3, ttl: 2000 } })
  @Post('/dislike')
  async dislike(
    @Body() body: { publicacionId: string },
    @Headers() headers: any,
  ) {
    const token = headers.authorization.split(' ')[1];
    const decodificado = this.authService.leerToken(token);
    try {
      const usuarioId = new ObjectId((decodificado as any).id);
      const publicacionId = new ObjectId(body.publicacionId);
      await this.publicacionesService.darDislike(usuarioId, publicacionId);
      return { payload: true };
    } catch (err) {
      console.log(err);
    }
  }
}
