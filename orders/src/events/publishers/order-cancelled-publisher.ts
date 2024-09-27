import { Subjects, Publisher, OrderCancelledEvent } from '@rtticketingorg/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
