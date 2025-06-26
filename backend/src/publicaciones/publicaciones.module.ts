import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Publicacion,
  PublicacionSchema,
} from './publicaciones/entities/publicacion.entity';
import { PublicacionesController } from './publicaciones/publicaciones.controller';
import { PublicacionesService } from './publicaciones/publicaciones.service';
import { ComentariosModule } from './comentarios/comentarios.module';
import { AuthService } from '../auth/auth.service';
import { UtilsModule } from '../utils/utils.module';

@Module({
  controllers: [PublicacionesController],
  providers: [PublicacionesService, AuthService],
  imports: [
    MongooseModule.forFeature([
      { name: Publicacion.name, schema: PublicacionSchema },
    ]),
    ComentariosModule,
    UtilsModule,
  ],
})
export class PublicacionesModule {}
