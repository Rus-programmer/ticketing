import mongoose from 'mongoose';
import request from 'supertest';
import {app} from '../../app';
import {Order} from "../../models/order";
import {OrderStatus} from "@rtticketingorg/common";
import {stripe} from "../../stripe";
import {Payment} from "../../models/payments";

jest.mock('../../stripe')


it('returns a 404 when purchasing an order that does not exist', async () => {
    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({token: 'dfdfd', orderId: new mongoose.Types.ObjectId().toHexString()})
        .expect(404);
});

it('returns an 401 when purchasing an order that does not belong to the user', async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: orderId,
        userId,
        version: 0,
        price: 30,
        status: OrderStatus.Created
    })
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin())
        .send({token: 'dfdfd', orderId})
        .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: orderId,
        userId,
        version: 0,
        price: 30,
        status: OrderStatus.Cancelled
    })
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({token: 'dfdfd', orderId})
        .expect(400);
});

// it('returns a 201 with valid inputs p.s. stripe real testing', async () => {
//     const orderId = new mongoose.Types.ObjectId().toHexString();
//     const price = Math.floor(Math.random() * 10)
//     const userId = new mongoose.Types.ObjectId().toHexString();
//     const order = Order.build({
//         id: orderId,
//         userId,
//         version: 0,
//         price,
//         status: OrderStatus.Created
//     })
//     await order.save();
//
//     await request(app)
//         .post('/api/payments')
//         .set('Cookie', global.signin(userId))
//         .send({token: 'tok_visa', orderId})
//         .expect(201);
//
//     const stripeCharges = await stripe.charges.list({limit: 5})
//     const stripeCharge = stripeCharges.data.find(charge => charge.amount === price * 100);
//     expect(stripeCharge).toBeDefined()
//     const payment = await Payment.findOne({
//         orderId: order.id,
//         stripeId: stripeCharge.id
//     })
//     expect(payment).toBeTruthy()
// });

it('returns a 201 with valid inputs p.s. stripe mock testing', async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();
    const userId = new mongoose.Types.ObjectId().toHexString();
    const order = Order.build({
        id: orderId,
        userId,
        version: 0,
        price: 30,
        status: OrderStatus.Created
    })
    await order.save();

    await request(app)
        .post('/api/payments')
        .set('Cookie', global.signin(userId))
        .send({token: 'tok_visa', orderId})
        .expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0]

    expect(stripe.charges.create).toHaveBeenCalled()
    expect(chargeOptions.source).toEqual('tok_visa')
    expect(chargeOptions.amount).toEqual(order.price * 100)
    expect(chargeOptions.currency).toEqual('usd')
});

