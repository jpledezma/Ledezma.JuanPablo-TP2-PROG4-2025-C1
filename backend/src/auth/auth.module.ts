import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { UsuarioService } from '../usuario/usuario.service';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from '../usuario/entities/usuario.entity';
import { SupabaseService } from '../supabase/supabase.service';

@Module({
  providers: [UsuarioService, AuthService, SupabaseService],
  controllers: [AuthController],
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
  ],
})
export class AuthModule {}
