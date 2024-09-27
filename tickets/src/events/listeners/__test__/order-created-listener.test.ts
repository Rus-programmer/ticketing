import {Listener, OrderCreatedEvent, OrderStatus} from "@rtticketingorg/common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";

import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {OrderCreatedListener} from "../order-created-listener";

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
    let data: OrderCreatedEvent['data'], listener: Listener<OrderCreatedEvent>;
    beforeEach(async () => {
        const ticket = Ticket.build({
            title: 'condf',
            price: 99,
            userId: '4343'
        })
        await ticket.save();

        data = {
            id: new mongoose.Types.ObjectId().toHexString(),
            status: OrderStatus.Created,
            expiresAt: 'fd',
            ticket: {
                id: ticket.id,
                price: ticket.price,
            },
            version: 0,
            userId: new mongoose.Types.ObjectId().toHexString()
        }

        listener = new OrderCreatedListener(natsWrapper.client)
    })

    it('should sets orderId of the ticket', async function () {
        await listener.onMessage(data, msg);
        const ticket = await Ticket.findById(data.ticket.id)
        expect(ticket).toBeDefined()
        expect(ticket?.orderId).toEqual(data.id)
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
})
