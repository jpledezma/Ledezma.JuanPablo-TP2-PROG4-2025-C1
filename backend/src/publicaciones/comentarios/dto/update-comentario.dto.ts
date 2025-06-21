import { OmitType } from '@nestjs/mapped-types';
import { CreateComentarioDto } from './create-comentario.dto';

export class UpdateComentarioDto extends OmitType(CreateComentarioDto, [
  'publicacionId',
  'usuarioId',
]) {}
