import { IsString } from 'class-validator';

export class CreateComentarioDto {
  @IsString()
  usuarioId: string;

  @IsString()
  publicacionId: string;

  @IsString()
  contenido: string;
}
