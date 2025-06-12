import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreatePublicacionDto {
  @IsString()
  usuarioId: string;

  @IsString()
  titulo: string;

  @IsString()
  contenido: string;

  @IsString()
  @IsOptional()
  urlImagen?: string;
}
