import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PublicacionesModule } from './publicaciones/publicaciones.module';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { UtilsModule } from './utils/utils.module';
import { EstadisticasModule } from './estadisticas/estadisticas.module';

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
    EstadisticasModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
