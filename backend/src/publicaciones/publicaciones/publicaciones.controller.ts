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
} from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { ObjectId } from 'mongodb';
import { FileInterceptor } from '@nestjs/platform-express';
import { LogueadoGuard } from '../../guards/logueado/logueado.guard';
import { Throttle } from '@nestjs/throttler';
import { ImagenesUtils } from '../../utils/utils/imagenes.utils';

@UseGuards(LogueadoGuard)
@Controller('publicaciones')
export class PublicacionesController {
  constructor(
    private readonly publicacionesService: PublicacionesService,
    private readonly imgUtils: ImagenesUtils,
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
  async findAll() {
    const publicaciones = await this.publicacionesService.findAll();
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
      return resultado;
    } else {
      throw new HttpException(
        'No se encontró la publicación',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  @Patch('publicacion/:id')
  update(
    @Param('id') id: string,
    @Body() updatePublicacioneDto: UpdatePublicacionDto,
  ) {
    return this.publicacionesService.update(+id, updatePublicacioneDto);
  }

  @Delete('publicacion/:id')
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

  @Throttle({ default: { limit: 3, ttl: 2000 } })
  @Post('/like')
  async like(@Body() body: { usuarioId: string; publicacionId: string }) {
    const { usuarioId, publicacionId } = body;
    try {
      await this.publicacionesService.darLike(usuarioId, publicacionId);
      return { payload: true };
    } catch (err) {
      console.log(err);
      // internal server error
    }
  }

  @Throttle({ default: { limit: 3, ttl: 2000 } })
  @Post('/dislike')
  async dislike(@Body() body: { usuarioId: string; publicacionId: string }) {
    const { usuarioId, publicacionId } = body;
    try {
      await this.publicacionesService.darDislike(usuarioId, publicacionId);
      return { payload: true };
    } catch (err) {
      console.log(err);
      // internal server error
    }
  }
}
