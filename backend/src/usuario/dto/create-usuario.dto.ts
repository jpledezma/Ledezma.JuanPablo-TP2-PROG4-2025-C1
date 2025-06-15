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

  @IsString() // form-data solo manda texto :3
  fechaNacimiento: number;

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
