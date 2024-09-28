import {Listener, OrderCancelledEvent} from "@rtticketingorg/common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";

import {Ticket} from "../../../models/ticket";
import {natsWrapper} from "../../../nats-wrapper";
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
    let data: OrderCancelledEvent['data'], listener: Listener<OrderCancelledEvent>;
    beforeEach(async () => {
        const ticket = Ticket.build({
            title: 'condf',
            price: 99,
            userId: '4343'
        })
        await ticket.save();

        data = {
            id: new mongoose.Types.ObjectId().toHexString(),
            ticket: {
                id: ticket.id,
            },
            version: 0,
        }

        listener = new OrderCancelledListener(natsWrapper.client)
    })

    it('should sets orderId of the ticket to undefined', async function () {
        await listener.onMessage(data, msg);
        const ticket = await Ticket.findById(data.ticket.id)
        expect(ticket).toBeDefined()
        expect(ticket?.orderId).not.toBeDefined()
    });

    it('should ack the message', async function () {
        await listener.onMessage(data, msg);
        expect(msg.ack).toHaveBeenCalled()
    });

    it('should throw error if ticket is not found', async function () {
        const dataWithRandomId = {
            ...data,
            ticket: {
                ...data.ticket,
                id: new mongoose.Types.ObjectId().toHexString()
            }
        }
        try {
            await listener.onMessage(dataWithRandomId, msg);
        } catch (e) {
            expect(e).toBeDefined()
        }

        expect(msg.ack).not.toHaveBeenCalled()
    });

    it('should publish a ticket updated event', async function () {
        await listener.onMessage(data, msg);

        expect(natsWrapper.client.publish).toHaveBeenCalled()
    });
})
