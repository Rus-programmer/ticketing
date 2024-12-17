import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketTickets } from '@my-rus-package/ticketing';

@Module({
  imports: [TypeOrmModule.forFeature([TicketTickets])],
  providers: [TicketsService],
  controllers: [TicketsController],
})
export class TicketsModule {}
