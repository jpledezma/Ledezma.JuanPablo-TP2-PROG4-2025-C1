import { IsOptional, IsString } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsString()
  email: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

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
