import { Publisher, Subjects, TicketCreatedEvent } from '@rtticketingorg/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
