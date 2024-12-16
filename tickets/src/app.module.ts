import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketsModule } from './tickets/tickets.module';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@my-rus-package/ticketing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import databaseConfig from './config/database.config';
import environmentValidation from './config/environment.validation';
import { jwtConfig } from '@my-rus-package/ticketing';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TicketsModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
      validationSchema: environmentValidation,
    }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider() as any),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService) => ({
        secret: configService.get('jwt.accessTokenSecret'),
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
