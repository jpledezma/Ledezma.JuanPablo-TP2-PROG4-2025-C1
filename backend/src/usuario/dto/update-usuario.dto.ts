import { IsOptional, IsString } from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  apellido: string;

  @IsOptional()
  @IsString()
  fechaNacimiento?: number;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  urlFotoPerfil?: string;

  @IsOptional()
  @IsString()
  urlFotoThumbnail?: string;
}
