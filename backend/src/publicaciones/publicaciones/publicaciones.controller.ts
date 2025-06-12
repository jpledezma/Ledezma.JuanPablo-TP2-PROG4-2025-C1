import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { PublicacionesService } from './publicaciones.service';
import { CreatePublicacionDto } from './dto/create-publicacion.dto';
import { UpdatePublicacionDto } from './dto/update-publicacion.dto';

@Controller('publicaciones')
export class PublicacionesController {
  constructor(private readonly publicacionesService: PublicacionesService) {}

  @Post()
  create(@Body() publicacion: CreatePublicacionDto) {
    const publicacionCreada = { ...publicacion };
    publicacion['usuario'] = {
      nombre: 'Axel',
      apellido: 'Kaiser',
      urlFotoThumbnail:
        'https://avatars.githubusercontent.com/u/75924747?s=40&v=4',
    };
    publicacion['fecha'] = Date.now();
    publicacion['likes'] = 0;
    publicacion['dislikes'] = 0;

    return this.publicacionesService.create(publicacion);
  }

  @Get()
  findAll() {
    return this.publicacionesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    const resultado = this.publicacionesService.findOne(+id);
    if (!resultado.payload) {
      throw new NotFoundException(`Publicacion con id ${id} no encontrada`);
    }

    return this.publicacionesService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePublicacioneDto: UpdatePublicacionDto,
  ) {
    return this.publicacionesService.update(+id, updatePublicacioneDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicacionesService.remove(+id);
  }
}
