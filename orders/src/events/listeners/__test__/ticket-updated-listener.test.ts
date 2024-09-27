import {Listener, TicketUpdatedEvent} from "@rtticketingorg/common";
import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {natsWrapper} from "../../../nats-wrapper";
import {Ticket} from "../../../models/ticket";
import {TicketUpdatedListener} from "../ticket-updated-listener";

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

describe('TicketUpdatedListener', () => {
    let ticket, data: TicketUpdatedEvent['data'], listener: Listener<TicketUpdatedEvent>;
    beforeEach(async () => {
        ticket = Ticket.build({
            id: new mongoose.Types.ObjectId().toHexString(),
            title: 'fdofjdoj',
            price: 204
        })
        await ticket.save()

        data = {
            version: ticket.version + 1,
            id: ticket.id,
            title: ticket.title,
            price: ticket.price,
            userId: ticket.userId
        }

        listener = new TicketUpdatedListener(natsWrapper.client)
    })

    it('should find, update and save a ticket', async function () {
        await listener.onMessage(data, msg);
        const ticket = await Ticket.findById(data.id)

        expect(ticket).toBeDefined()
        expect(ticket?.title).toEqual(data.title)
        expect(ticket?.price).toEqual(data.price)
        expect(ticket?.version).toEqual(data.version)
    });

    it('should ack the message', async function () {
        await listener.onMessage(data, msg);

        expect(msg.ack).toHaveBeenCalled()
    });

    it('should does not call ack if the event has skipped version number', async function () {
        const dataSkippedVersion = {...data, version: data.version + 10}
        try {
            await listener.onMessage(dataSkippedVersion, msg);
        } catch (e) {
            console.log('e', e)
            expect(e).toBeTruthy()
        }

        expect(msg.ack).not.toHaveBeenCalled()
    });
})
