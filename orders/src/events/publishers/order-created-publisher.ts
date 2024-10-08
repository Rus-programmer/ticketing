import { Publisher, OrderCreatedEvent, Subjects } from '@rtticketingorg/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
