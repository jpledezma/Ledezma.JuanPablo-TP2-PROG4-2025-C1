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
import { UsuarioService } from './usuario.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { GetPublicUsuarioDto } from './dto/get-public-usuario.dto';
import { LogueadoGuard } from '../guards/logueado/logueado.guard';
import { Types } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { AdminGuard } from '../guards/admin/admin.guard';

@UseGuards(LogueadoGuard)
@Controller('usuarios')
export class UsuarioController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AdminGuard)
  @UseGuards(LogueadoGuard)
  @Get()
  async findAll() {
    const usuarios = await this.usuarioService.findAll();
    return usuarios;
  }

  @UseGuards(AdminGuard)
  @UseGuards(LogueadoGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    const usuario = await this.usuarioService.findById(id);
    return usuario;
  }

  @UseGuards(LogueadoGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Headers() headers: any,
  ) {
    const token = headers.authorization.split(' ')[1];
    const decodificado = this.authService.leerToken(token);
    if ((decodificado as any).id !== id) {
      throw new HttpException('Bad request', HttpStatus.UNAUTHORIZED);
    }

    try {
      const objId = new Types.ObjectId(id);
      return this.usuarioService.update(objId, updateUsuarioDto);
    } catch (error) {
      console.log(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AdminGuard)
  @UseGuards(LogueadoGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      const objId = new Types.ObjectId(id);
      return this.usuarioService.remove(objId);
    } catch (error) {
      console.log(error);
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(LogueadoGuard)
  @Get('public/:id')
  async findByIdPublic(@Param('id') id: string) {
    const usuario = await this.usuarioService.findById(id);
    if (!usuario) {
      return { payload: null };
    }

    const payload: GetPublicUsuarioDto = {
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      username: usuario.username,
      descripcion: usuario.descripcion,
      urlFotoPerfil: usuario.urlFotoPerfil,
      urlFotoThumbnail: usuario.urlFotoPerfil,
    };

    return { payload };
  }
}
