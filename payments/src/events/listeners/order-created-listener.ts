import {Listener, OrderCreatedEvent, Subjects} from "@rtticketingorg/common";
import {Message} from "node-nats-streaming";
import {queueGroupName} from "./queue-group-name";
import {Order} from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    queueGroupName: string = queueGroupName;
    readonly subject = Subjects.OrderCreated;

    async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
        const order = Order.build({
            id: data.id,
            status: data.status,
            price: data.ticket.price,
            userId: data.userId,
            version: data.version
        })
        await order.save()

        msg.ack()
    }
}