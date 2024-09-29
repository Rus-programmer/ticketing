import {ExpirationCompleteEvent, Listener, OrderStatus} from "@rtticketingorg/common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";

import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {ExpirationCompleteListener} from "../expiration-complete-listener";
import {Order} from "../../../models/order";

const msg: jest.MockedObject<Message> = {
    getCrc32: jest.fn(),
    getData: jest.fn(),
    getRawData: jest.fn(),
    getSequence: jest.fn(),
    getSubject: jest.fn(),
    getTimestamp: jest.fn(),
    getTimestampRaw: jest.fn(),
    isRedelivered: jest.fn(),
    ack: jest.fn()
}

describe('TicketCreatedListener', () => {
    let data: ExpirationCompleteEvent['data'], listener: Listener<ExpirationCompleteEvent>;
    beforeEach(async () => {
        listener = new ExpirationCompleteListener(natsWrapper.client)

        const ticket = Ticket.build({
            id: new mongoose.Types.ObjectId().toHexString(),
            title: 'fdfd',
            price: 23
        })
        await ticket.save()

        const order = Order.build({
            userId: new mongoose.Types.ObjectId().toHexString(),
            expiresAt: new Date(),
            status: OrderStatus.Created,
            ticket
        })
        await order.save()

        data = {
            orderId: order.id,
        }
    })

    it('should set order as cancelled', async function () {
        await listener.onMessage(data, msg);

        const order = await Order.findById(data.orderId)
        expect(order?.status).toEqual(OrderStatus.Cancelled)
    });

    it('should emit an OrderCancelled event', async function () {
        await listener.onMessage(data, msg);

        expect(natsWrapper.client.publish).toHaveBeenCalled()
    });

    it('should ack the message', async function () {
        await listener.onMessage(data, msg);

        expect(msg.ack).toHaveBeenCalled()
    });
})
