import buildClient from '../../api/build-client';

const TicketShow = ({ticket}) => {
    return (
        <div>
            <h1>{ticket.title}</h1>
            <h4>Price: {ticket.price}</h4>
        </div>
    )
}

TicketShow.getInitialProps = async (context, _) => {
    const {ticketId} = context.query;
    const client = buildClient(context)

    const {data} = await client.get(`/api/v1/tickets/${ticketId}`)
    console.log('data', data)
    return {ticket: data}
}

export default TicketShow;