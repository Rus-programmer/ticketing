import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import environmentValidation from './config/environment.validation';
import jwtConfig from './config/jwt.config';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, KafkaTopicsService } from '@my-rus-package/ticketing';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
      validationSchema: environmentValidation,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService) => ({
        secret: configService.get('jwt.accessTokenSecret'),
        signOptions: {
          expiresIn: configService.get('jwt.accessTokenTtl'),
        },
      }),
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    KafkaTopicsService,
  ],
})
export class AppModule {}
