import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { isValidObjectId } from 'mongoose';
import { UsuarioService } from './usuario.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { GetPublicUsuarioDto } from './dto/get-public-usuario.dto';
import { LogueadoGuard } from '../guards/logueado/logueado.guard';
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
  @Get()
  async findAll() {
    const usuarios = await this.usuarioService.findAll();
    return usuarios;
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Headers() headers: any) {
    const token = headers.authorization.split(' ')[1];
    const decodificado: any = this.authService.leerToken(token);

    if (decodificado.id === id || decodificado.acceso === 'admin') {
      const usuario = await this.usuarioService.findById(id);
      return usuario;
    } else {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
    @Headers() headers: any,
  ) {
    const token = headers.authorization.split(' ')[1];
    const decodificado: any = this.authService.leerToken(token);
    if (decodificado.id !== id) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    if (!isValidObjectId(id)) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    return this.usuarioService.update(new ObjectId(id), updateUsuarioDto);
  }

  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    return this.usuarioService.remove(new ObjectId(id));
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
      username: usuario.username,
      descripcion: usuario.descripcion,
      urlFotoPerfil: usuario.urlFotoPerfil,
      urlFotoThumbnail: usuario.urlFotoPerfil,
    };

    return { payload };
  }
}
