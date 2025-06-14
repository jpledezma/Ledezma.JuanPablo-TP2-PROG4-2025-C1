import { Module } from '@nestjs/common';
import { PublicacionesController } from './publicaciones/publicaciones.controller';
import { PublicacionesService } from './publicaciones/publicaciones.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Publicacion,
  PublicacionSchema,
} from './publicaciones/entities/publicacion.entity';
import { SupabaseService } from 'src/supabase/supabase.service';

@Module({
  controllers: [PublicacionesController],
  providers: [PublicacionesService, SupabaseService],
  imports: [
    MongooseModule.forFeature([
      { name: Publicacion.name, schema: PublicacionSchema },
    ]),
  ],
})
export class PublicacionesModule {}
