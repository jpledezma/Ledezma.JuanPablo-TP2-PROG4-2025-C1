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
} from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';
import { ObjectId } from 'mongodb';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  filePipe = new ParseFilePipe({
    fileIsRequired: false,
    errorHttpStatusCode: HttpStatus.BAD_REQUEST,
    validators: [new MaxFileSizeValidator({ maxSize: 1500000 })],
  });

  @Post()
  @UseInterceptors(FileInterceptor('imagen', { dest: 'public' }))
  async create(
    @Body()
    publicacion: CreatePublicacionDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        validators: [new MaxFileSizeValidator({ maxSize: 2000000 })],
      }),
    )
    imagen?: Express.Multer.File,
  ) {
    const pCreada = await this.publicacionesService.create(publicacion);
    if (imagen) {
      const url = process.env.SITIO_URL;
      pCreada.urlImagen = url + imagen.filename;
    }
    return { payload: pCreada };
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
