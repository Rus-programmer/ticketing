import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import databaseConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import environmentValidation from './config/environment.validation';

@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      validationSchema: environmentValidation,
    }),
    TypeOrmModule.forRootAsync(databaseConfig.asProvider() as any),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
