import { Module } from '@nestjs/common';
import { PublicacionesController } from './publicaciones/publicaciones.controller';
import { PublicacionesService } from './publicaciones/publicaciones.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Publicacion,
  PublicacionSchema,
} from './publicaciones/entities/publicacion.entity';

@Module({
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  /*imports: [
    MongooseModule.forFeature([
      { name: Publicacion.name, schema: PublicacionSchema },
    ]),
  ],*/
})
export class PublicacionesModule {}
