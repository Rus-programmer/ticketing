import useRequest from "../../hooks/use-request";
import {useEffect, useState} from "react";
import StripeCheckout from "react-stripe-checkout";
import Router from "next/router";

const OrderShow = ({order, currentUser}) => {
    const [timeLeft, setTimeLeft] = useState(0)
    const {doRequest, errors} = useRequest({
        url: '/api/payments',
        method: 'post',
        body: {
            orderId: order.id,
        },
        onSuccess: () => Router.push('/orders')
    })

    useEffect(() => {
        const findTimeLeft = () => {
            const msLeft = new Date(order.expiresAt) - new Date();
            setTimeLeft(Math.round(msLeft / 1000))
        }
        findTimeLeft();
        const interval = setInterval(findTimeLeft, 1000)

        return () => clearInterval(interval)
    }, [])

    if (timeLeft < 0) {
        return <div>Order expired</div>
    }

    return (
        <>
            <div>Time left to pay: {timeLeft} seconds</div>
            {errors}
            <StripeCheckout
                token={({id}) => doRequest({token: id})}
                amount={order.ticket.price}
                email={currentUser.email}
                stripeKey="pk_test_51Q4NbnLRjNmwY9xPxE3EhGHGCi4cQtseVj9O67JMFotbj3Dy2Rg956ipGz3UftFQWuwPhzYYhORJ0oY88cCq5dq900MxbaAzay"
            />
        </>
    )
}

OrderShow.getInitialProps = async (context, client) => {
    const {orderId} = context.query;

    const {data} = await client.get(`/api/orders/${orderId}`)
    return {order: data}
}

export default OrderShow;