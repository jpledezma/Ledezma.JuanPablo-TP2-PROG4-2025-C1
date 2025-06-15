import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Headers,
  Get,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';
import { UsuarioService } from '../usuario/usuario.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly authService: AuthService,
  ) {}
  @Post('registro')
  async registrar(@Body() usuarioDto: CreateUsuarioDto) {
    const salt = 12;
    const hash = await bcrypt.hash(usuarioDto.password, salt);
    usuarioDto.password = hash;

    try {
      const usuarioCreado = await this.usuarioService.create(usuarioDto);
      const token = this.authService.crearToken(
        usuarioCreado._id,
        usuarioCreado.username,
      );

      return { payload: token };
    } catch (err) {
      console.log(err);

      return { payload: null };
    }
  }

  @Post('login')
  async loguear(@Body() body: { username: string; password: string }) {
    let usuario = await this.usuarioService.findByUsername(body.username);
    if (!usuario) {
      usuario = await this.usuarioService.findByEmail(body.username);
    }

    if (!usuario) {
      console.log('no está che');
      throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(body.password, usuario.password);

    if (!isMatch) {
      throw new HttpException(
        'La contraseña no coincide',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = this.authService.crearToken(usuario._id, usuario.username);

    return { payload: token };
  }

  @Get('validar')
  async validarToken(@Headers() headers: any) {
    const token = headers.authorization.split(' ')[1];
    const decodificado = this.authService.leerToken(token);

    if (!decodificado) {
      return { valido: false };
    } else {
      return {
        valido: decodificado !== null,
        id: (decodificado as any).id,
      };
    }
  }

  @Get('refresh-token')
  generarNuevoToken(@Headers() headers: any) {
    // comprobar token y volver a generar
    const token = headers.authorization.split(' ')[1];

    const verificado = this.authService.leerToken(token);
    if (!verificado) {
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
    }

    const id = verificado['id'];
    const username = verificado['username'];
    const nuevoToken = this.authService.crearToken(id, username);

    return { payload: nuevoToken };
  }
}
