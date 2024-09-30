import {PaymentCreatedEvent, Publisher, Subjects} from '@rtticketingorg/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    readonly subject = Subjects.PaymentCreated;
}
