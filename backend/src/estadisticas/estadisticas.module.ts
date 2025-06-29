import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EstadisticasController } from './estadisticas.controller';
import { EstadisticasService } from './estadisticas.service';
import { AuthService } from '../auth/auth.service';
import { Usuario, UsuarioSchema } from '../usuario/entities/usuario.entity';
import {
  Comentario,
  ComentarioSchema,
} from '../publicaciones/comentarios/entities/comentario.entity';
import {
  Publicacion,
  PublicacionSchema,
} from '../publicaciones/publicaciones/entities/publicacion.entity';

@Module({
  controllers: [EstadisticasController],
  providers: [EstadisticasService, AuthService],
  imports: [
    MongooseModule.forFeature([
      { name: Publicacion.name, schema: PublicacionSchema },
    ]),
    MongooseModule.forFeature([
      { name: Comentario.name, schema: ComentarioSchema },
    ]),
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
  ],
})
export class EstadisticasModule {}
