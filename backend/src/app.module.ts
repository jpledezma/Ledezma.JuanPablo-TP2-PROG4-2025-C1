import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { UsuarioModule } from './usuario/usuario.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UtilsModule } from './utils/utils.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI!),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          // NO SE PUEDE PONER NOMBRE SI QUIERO USAR
          // DECORADORES EN UN CONTROLADOR O ROUTE
          // AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA
          // name: 'general',
          ttl: 60 * 1000,
          limit: 100,
        },
      ],
    }),
    PublicacionesModule,
    UsuarioModule,
    AuthModule,
    UtilsModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
