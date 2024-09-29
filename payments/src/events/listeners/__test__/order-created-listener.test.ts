import {Listener, OrderCreatedEvent, OrderStatus} from "@rtticketingorg/common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";

import {natsWrapper} from "../../../nats-wrapper";
import {OrderCreatedListener} from "../order-created-listener";
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

describe('OrderCreatedListener', () => {
    let listener: Listener<OrderCreatedEvent>, data: OrderCreatedEvent['data'];
    beforeEach(async () => {
        listener = new OrderCreatedListener(natsWrapper.client)
        data = {
            id: new mongoose.Types.ObjectId().toHexString(),
            version: 0,
            expiresAt: 'fd',
            status: OrderStatus.Created,
            userId: new mongoose.Types.ObjectId().toHexString(),
            ticket: {
                id: 'dfd',
                price: 10
            }
        }
        await listener.onMessage(data, msg);
    })

    it('should replicate the order info', async function () {
        const order = await Order.findById(data.id)
        expect(order).toBeDefined()
        expect(order?.price).toEqual(data.ticket.price)
    });

    it('should ack the message', async function () {
        expect(msg.ack).toHaveBeenCalled()
    });
})
