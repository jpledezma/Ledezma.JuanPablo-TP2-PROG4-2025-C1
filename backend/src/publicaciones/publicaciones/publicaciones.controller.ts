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
import { createHash } from 'crypto';
import { SupabaseService } from 'src/supabase/supabase.service';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(
    private readonly publicacionesService: PublicacionesService,
    private readonly supabaseService: SupabaseService,
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
      const nombreSeparado = imagen.originalname.split('.');
      const extension = nombreSeparado[nombreSeparado.length - 1];
      let hash = createHash('md5')
        .update(imagen.originalname)
        .digest('base64url');
      hash = hash.slice(0, 8); // con 8 caracteres me basta
      const nuevoNombre = `${Date.now()}.${hash}.${extension}`;
      imagen.originalname = nuevoNombre;
      // const data = await this.publicacionesService.guardarImagen(
      const data = await this.supabaseService.guardarImagen(
        imagen.buffer,
        nuevoNombre,
        extension,
        'publicaciones',
      );

      const url = this.supabaseService.obtenerUrl(data?.path, 'publicaciones');
      // const url = this.publicacionesService.obtenerUrl(
      //   data?.path,
      //   'publicaciones',
      // );
      publicacion.urlImagen = url.data.publicUrl;
    }

    const pCreada = await this.publicacionesService.create(publicacion);

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
