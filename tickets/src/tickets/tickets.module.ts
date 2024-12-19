import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientsModule } from '@nestjs/microservices';
import { TICKETS_SERVICE } from '../constants/kafka.constants';
import { kafkaConfig } from '../config/kafka.config';
import { TicketTickets } from '../entities/ticket.tickets.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([TicketTickets]),
    ClientsModule.register([
      {
        name: TICKETS_SERVICE,
        ...kafkaConfig,
      },
    ]),
  ],
  providers: [TicketsService],
  controllers: [TicketsController],
})
export class TicketsModule {}
