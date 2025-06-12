import { OmitType } from '@nestjs/mapped-types';
import { CreatePublicacionDto } from './create-publicacion.dto';

export class UpdatePublicacionDto extends OmitType(CreatePublicacionDto, [
  'usuarioId',
  'urlImagen',
]) {}
