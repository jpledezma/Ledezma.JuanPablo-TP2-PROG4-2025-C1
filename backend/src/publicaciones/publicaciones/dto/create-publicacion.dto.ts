import { IsOptional, IsString } from 'class-validator';

export class CreatePublicacionDto {
  @IsString()
  usuarioId: string;

  @IsString()
  titulo: string;

  @IsString()
  contenido: string;

  @IsOptional()
  urlImagen?: Express.Multer.File;
}
