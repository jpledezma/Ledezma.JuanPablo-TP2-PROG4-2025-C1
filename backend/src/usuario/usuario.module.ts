import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuario, UsuarioSchema } from './entities/usuario.entity';
import { AuthService } from '../auth/auth.service';

@Module({
  controllers: [UsuarioController],
  providers: [UsuarioService, AuthService],
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
  ],
})
export class UsuarioModule {}
