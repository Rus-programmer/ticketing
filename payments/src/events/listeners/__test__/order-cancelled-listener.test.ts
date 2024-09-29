import {Listener, OrderCancelledEvent, OrderStatus} from "@rtticketingorg/common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";

import {natsWrapper} from "../../../nats-wrapper";
import {Order} from "../../../models/order";
import {OrderCancelledListener} from "../order-cancelled-listener";

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

describe('OrderCancelledListener', () => {
    let listener: Listener<OrderCancelledEvent>, data: OrderCancelledEvent['data'];
    beforeEach(async () => {
        listener = new OrderCancelledListener(natsWrapper.client)
        const order = Order.build({
            id: new mongoose.Types.ObjectId().toHexString(),
            version: 0,
            price: 10,
            status: OrderStatus.Created,
            userId: new mongoose.Types.ObjectId().toHexString(),
        })
        await order.save()

        data = {
            id: order.id,
            version: 1,
            ticket: {
                id: 'dsds',
            }
        }
        await listener.onMessage(data, msg);
    })

    it('should update the status of the order', async function () {
        const order = await Order.findById(data.id)
        expect(order).toBeDefined()
        expect(order?.status).toEqual(OrderStatus.Cancelled)
    });

    it('should ack the message', async function () {
        expect(msg.ack).toHaveBeenCalled()
    });
})
