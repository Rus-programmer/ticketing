import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';
import {OrderStatus} from "@rtticketingorg/common";

interface OrderAttrs {
    id: string;
    status: OrderStatus;
    version: number;
    userId: string;
    price: number;
}

interface OrderDoc extends mongoose.Document {
    status: OrderStatus;
    version: number;
    userId: string;
    price: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            required: true,
            enum: Object.values(OrderStatus),
            default: OrderStatus.Created,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
            },
        },
    }
);
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order({
        ...attrs,
        _id: attrs.id,
    });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Ticket', orderSchema);

export {Order};
