import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
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
      return { payload: usuarioCreado };
    } catch (err) {
      return { error: err };
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
      return { payload: null };
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
}
