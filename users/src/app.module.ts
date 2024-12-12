import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import databaseConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import environmentValidation from './config/environment.validation';
import appConfig from './config/app.config';
import { APP_FILTER } from '@nestjs/core';
import { RpcExFilter } from './filters/rpc-exception.filter';
import { KafkaTopicsService } from '@my-rus-package/ticketing';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, appConfig],
      validationSchema: environmentValidation,
    }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider() as any),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: RpcExFilter,
    },
  ],
})
export class AppModule {}
