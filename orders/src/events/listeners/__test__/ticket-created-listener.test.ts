import {TicketCreatedEvent} from "@rtticketingorg/common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";

import {TicketCreatedListener} from "../ticket-created-listener";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";

const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString()
}
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
    beforeEach(async () => {
        const listener = new TicketCreatedListener(natsWrapper.client)
        await listener.onMessage(data, msg);
    })

    it('should create and save a ticket', async function () {
        const ticket = await Ticket.findById(data.id)
        expect(ticket).toBeDefined()
        expect(ticket?.title).toEqual(data.title)
        expect(ticket?.price).toEqual(data.price)
    });

    it('should ack the message', async function () {
        expect(msg.ack).toHaveBeenCalled()
    });
})
