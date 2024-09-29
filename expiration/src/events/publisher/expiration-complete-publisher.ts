import {ExpirationCompleteEvent, Publisher, Subjects} from "@rtticketingorg/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    readonly subject = Subjects.ExpirationComplete;
}