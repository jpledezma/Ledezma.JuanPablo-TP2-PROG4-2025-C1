import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { GetPublicUsuarioDto } from './dto/get-public-usuario.dto';
import { LogueadoGuard } from '../guards/logueado/logueado.guard';

@UseGuards(LogueadoGuard)
@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  // @UseGuards(AdminGuard)
  @Get()
  async findAll() {
    const usuarios = await this.usuarioService.findAll();
    return usuarios;
  }

  // @UseGuards(AdminGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    const usuario = await this.usuarioService.findById(id);
    return usuario;
  }

  // @UseGuards(AdminGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return this.usuarioService.update(+id, updateUsuarioDto);
  }

  // @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.usuarioService.remove(+id);
  }

  @Get('public/:id')
  async findByIdPublic(@Param('id') id: string) {
    const usuario = await this.usuarioService.findById(id);
    if (!usuario) {
      return { payload: null };
    }

    const payload: GetPublicUsuarioDto = {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      descripcion: usuario.descripcion,
      urlFotoPerfil: usuario.urlFotoPerfil,
      urlFotoThumbnail: usuario.urlFotoPerfil,
    };

    return { payload };
  }
}
