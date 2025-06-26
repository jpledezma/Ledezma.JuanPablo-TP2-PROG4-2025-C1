import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsuarioService } from '../usuario/usuario.service';
import { Usuario, UsuarioSchema } from '../usuario/entities/usuario.entity';
import { UtilsModule } from '../utils/utils.module';

@Module({
  providers: [UsuarioService, AuthService],
  controllers: [AuthController],
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
    UtilsModule,
  ],
})
export class AuthModule {}
