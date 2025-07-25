import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Headers,
  Get,
  UseInterceptors,
  UploadedFile,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from './auth.service';
import { CreateUsuarioDto } from '../usuario/dto/create-usuario.dto';
import { UsuarioService } from '../usuario/usuario.service';
import { ImagenesUtils } from '../utils/utils/imagenes.utils';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly authService: AuthService,
    private readonly imgUtils: ImagenesUtils,
  ) {}

  @Post('registro')
  @UseInterceptors(FileInterceptor('fotoPerfil'))
  async registrar(
    @Body() usuarioDto: CreateUsuarioDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        validators: [new MaxFileSizeValidator({ maxSize: 4_000_000 })],
      }),
    )
    fotoPerfil?: Express.Multer.File,
  ) {
    if (fotoPerfil) {
      const urls = await this.imgUtils.guardarImagen(
        fotoPerfil,
        'fotos-perfil',
        false, // esto es por el deploy, deberia ser true
      );

      usuarioDto.urlFotoPerfil = urls.urlImagen;
      usuarioDto.urlFotoThumbnail = urls.urlThumbail;
    }
    const hash = await bcrypt.hash(usuarioDto.password, 12);
    usuarioDto.password = hash;

    // no vaya a ser que se me pase
    (usuarioDto as any).acceso = undefined;

    if (isNaN(+usuarioDto.fechaNacimiento)) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    }

    usuarioDto.fechaNacimiento = +usuarioDto.fechaNacimiento;
    const usuarioCreado = await this.usuarioService.create(usuarioDto);
    const token = this.authService.crearToken(
      usuarioCreado._id,
      usuarioCreado.username,
      usuarioCreado.acceso,
    );

    return { payload: token };
  }

  @Post('login')
  async loguear(@Body() body: { username: string; password: string }) {
    let usuario = await this.usuarioService.findByUsername(body.username);
    if (!usuario) {
      usuario = await this.usuarioService.findByEmail(body.username);
    }

    if (!usuario) {
      throw new HttpException('El usuario no existe', HttpStatus.NOT_FOUND);
    }

    const isMatch = await bcrypt.compare(body.password, usuario.password);

    if (!isMatch) {
      throw new HttpException(
        'La contraseña no coincide',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = this.authService.crearToken(
      usuario._id,
      usuario.username,
      usuario.acceso,
    );

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
        valido: true,
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
    const acceso = verificado['acceso'];
    const nuevoToken = this.authService.crearToken(id, username, acceso);

    return { payload: nuevoToken };
  }
}
