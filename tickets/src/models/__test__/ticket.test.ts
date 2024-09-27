import { Ticket } from '../ticket';

it('implements optimistic concurrency control', async () => {
    const ticket = Ticket.build({
        title: 'title',
        price: 30,
        userId: '123'
    })
    await ticket.save()

    const firstInstance = await Ticket.findById(ticket.id)
    const secondInstance = await Ticket.findById(ticket.id)

    firstInstance?.set({price: 10})
    secondInstance?.set({price: 23})

    await firstInstance?.save()
    try {
        await secondInstance?.save();
    } catch (err) {
        expect(err).not.toBeNull()
        return
    }
    throw new Error()
});

it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({
        title: 'title',
        price: 30,
        userId: '123'
    })
    await ticket.save()
    expect(ticket.version).toEqual(0)

    await ticket.save()
    expect(ticket.version).toEqual(1)

    await ticket.save()
    expect(ticket.version).toEqual(2)
});
