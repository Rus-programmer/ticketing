import {useState} from "react";
import useRequest from "../../hooks/use-request";
import {log} from "next/dist/server/typescript/utils";
import Router from "next/router";

const NewTicket = () => {
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const {doRequest, errors} = useRequest({
        url: '/api/v1/tickets',
        method: 'post',
        body: {
            title, price
        },
        onSuccess: () => Router.push('/')
    })

    const handleBlur = () => {
        const value = parseFloat(price)
        if (isNaN(value)) {
            return;
        }
        setPrice(value.toFixed(2))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        doRequest()
    }

    return <div>
        <h1>Create a ticket</h1>
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="">Title</label>
                <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)}/>
            </div>
            <div className="form-group">
                <label htmlFor="">Price</label>
                <input
                    type="text"
                    className="form-control"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    onBlur={handleBlur}
                />
            </div>
            {errors}
            <button className="btn btn-primary">Submit</button>
        </form>
    </div>
}

export default NewTicket