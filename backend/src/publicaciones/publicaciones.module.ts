import { Module } from '@nestjs/common';
import { PublicacionesController } from './publicaciones/publicaciones.controller';
import { PublicacionesService } from './publicaciones/publicaciones.service';

@Module({
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  imports: [PublicacionesModule],
})
export class PublicacionesModule {}
