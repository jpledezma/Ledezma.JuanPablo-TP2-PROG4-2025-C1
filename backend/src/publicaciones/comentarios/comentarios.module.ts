import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ComentariosService } from './comentarios.service';
import { ComentariosController } from './comentarios.controller';
import { ComentarioSchema, Comentario } from './entities/comentario.entity';
import { AuthService } from '../../auth/auth.service';

@Module({
  controllers: [ComentariosController],
  providers: [ComentariosService, AuthService],
  imports: [
    MongooseModule.forFeature([
      { name: Comentario.name, schema: ComentarioSchema },
    ]),
  ],
})
export class ComentariosModule {}
