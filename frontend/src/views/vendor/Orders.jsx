import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import moment from 'moment';

import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import Sidebar from './Sidebar';

function Orders() {
    const [orders, setOrders] = useState([])

    useEffect(() => {
        apiInstance.get(`vendor/orders/${UserData()?.vendor_id}/`).then((res) => {
            setOrders(res.data)
        })
    }, [])

    const handlerFilterOrders = async (filter) => {
        console.log(filter);

        const response = await apiInstance.get(`vendor/orders/filter/${UserData()?.vendor_id}?filter=${filter}`)
        setOrders(response.data)
    }

    
    
  return (
    <div className="container-fluid" id="main" >
    <div className="row row-offcanvas row-offcanvas-left h-100">
        <Sidebar />
        <div className="col-md-9 col-lg-10 main">
            <div className="mb-3 mt-3" style={{ marginBottom: 300 }}>
                <div>
                    <h4><i className="bi bi-cart-check-fill"></i> All Orders  </h4>

                    


                    <div className="dropdown">
    <button className="btn btn-secondary dropdown-toggle btn-sm mt-3 mb-4" 
            type="button" 
            id="dropdownMenuClickable" 
            data-bs-toggle="dropdown" 
            data-bs-auto-close="false"
            aria-expanded="false">
        Filter <i className="fas fa-sliders"></i>
    </button>
    <ul className="dropdown-menu" aria-labelledby="ropdownMenuClickable">
        <li>
            <a className="dropdown-item" onClick={() => handlerFilterOrders("paid")}>Payment Status: Paid</a>
        </li>
        <li>
            <a className="dropdown-item" onClick={() => handlerFilterOrders("processing")}>Payment Status: Processing</a>
        </li>
        <li>
            <a className="dropdown-item" onClick={() => handlerFilterOrders("pending")}>Payment Status: Pending</a>
        </li>
        <li>
            <a className="dropdown-item" onClick={() => handlerFilterOrders("cancelled")}>Payment Status: Cancelled</a>
        </li>
        <hr/>
        <li>
            <a className="dropdown-item" onClick={() => handlerFilterOrders("latest")}>Date: Latest</a>
        </li>
        <li>
            <a className="dropdown-item" onClick={() => handlerFilterOrders("oldest")}>Date: Oldest</a>
        </li>
        <hr/>
        <li>
            <a className="dropdown-item" onClick={() => handlerFilterOrders("Pending")}>Order Status: Pending</a>
        </li>
        <li>
            <a className="dropdown-item" onClick={() => handlerFilterOrders("Fulfilled")}>Order Status: Fulfilled</a>
        </li>
        <li>
            <a className="dropdown-item" onClick={() => handlerFilterOrders("Cancelled")}>Order Status: Cancelled</a>
        </li>
    </ul>
</div>



                    

                    <table className="table">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col">#Order ID</th>
                                <th scope="col">Total</th>
                                <th scope="col">Pament Status</th>
                                <th scope="col">Order Status</th>
                                <th scope="col">Date</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.map((o, index) => (
                                <tr key={index}>
                                    <th scope="row">#{o.oid}</th>
                                    <td>{o.total}</td>
                                    <td>{o.payment_status?.toUpperCase()}</td>
                                    <td>{o.order_status?.toUpperCase()}</td>
                                    <td>{moment(o.date).format("MMM DD, YYYY")}</td>
                                    
                                    <td>
                                        <Link to={`/vendor/orders/${o.oid}/`} className="btn btn-primary mb-1">
                                            <i className="fas fa-eye" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}

                            {orders < 1 &&
                                <h5 className='mt-4 p-3'>No orders yet</h5>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
    </div>
  )
}

export default Orders