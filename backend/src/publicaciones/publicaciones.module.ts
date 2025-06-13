import { Module } from '@nestjs/common';
import { PublicacionesController } from './publicaciones/publicaciones.controller';
import { PublicacionesService } from './publicaciones/publicaciones.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Publicacion,
  PublicacionSchema,
} from './publicaciones/entities/publicacion.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createHash } from 'crypto';

@Module({
  controllers: [PublicacionesController],
  providers: [PublicacionesService],
  imports: [
    MongooseModule.forFeature([
      { name: Publicacion.name, schema: PublicacionSchema },
    ]),
    MulterModule.register({
      dest: 'public/imagenes',
      storage: diskStorage({
        destination(req, file, callback) {
          callback(null, 'public/imagenes');
        },
        filename(req, file, callback) {
          const nombreSeparado = file.originalname.split('.');
          const extension = nombreSeparado[nombreSeparado.length - 1];
          let hash = createHash('md5')
            .update(file.originalname)
            .digest('base64url');
          hash = hash.slice(0, 8); // con 8 caracteres me basta
          const nuevoNombre = `${Date.now()}.${hash}.${extension}`;
          callback(null, nuevoNombre);
        },
      }),
    }),
  ],
})
export class PublicacionesModule {}
