import { OmitType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';

export class GetPublicUsuarioDto extends OmitType(CreateUsuarioDto, [
  'password',
  'email',
  'fechaNacimiento',
]) {}
