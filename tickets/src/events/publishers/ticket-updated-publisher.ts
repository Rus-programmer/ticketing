import { Publisher, Subjects, TicketUpdatedEvent } from '@rtticketingorg/common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
