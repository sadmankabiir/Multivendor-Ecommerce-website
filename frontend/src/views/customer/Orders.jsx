import React from "react";
import Sidebar from "./Sidebar";
import apiInstance from "../../utils/axios";
import { useState, useEffect } from "react";
import UserData from "../plugin/UserData";
import { Link } from "react-router-dom";
import moment from "moment";
import { set } from "react-hook-form";

function Orders() {
  const [orders, setOrders] = useState([]);
  const userData = UserData();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiInstance.get(`customer/orders/${userData?.user_id}/`).then((res) => {
      setOrders(res.data);
      console.log(res.data);
      setIsLoading(false);
    });
  }, []);

  const statusCounts = orders.reduce((counts, order) => {
    const status = order.order_status;
    counts[status] = (counts[status] || 0) + 1;
    return counts;
  }, {});

  return (
    <main className="mt-5">
      <div className="container">
        <section className="">
          <div className="row">
            {/* <Sidebar /> */}
            <Sidebar />
            <div className="col-lg-9 mt-1">
              <main className="mb-5" style={{}}>
                <div className="container px-4">
                  {/* Section: Order Stats */}
                  <section className="mb-5">
                    <h3 className="mb-3">
                      <i className="fas fa-shopping-cart text-primary" /> Orders{" "}
                    </h3>
                    <div className="row gx-xl-5">
                      <div className="col-lg-4 mb-4 mb-lg-0">
                        <div
                          className="rounded shadow p-2"
                          style={{
                            backgroundColor: "#2a9d8f",
                            height: 120,
                          }}
                        >
                          <div className="card-body h-100">
                            <div className="d-flex align-items-center justify-between h-100">
                              <div className="">
                                <p className="mb-1">Orders</p>
                                <h2 className="mb-0">
                                  {orders.length || 0}
                                  <span
                                    className=""
                                    style={{
                                      fontSize: "0.875rem",
                                    }}
                                  ></span>
                                </h2>
                              </div>
                              <div className="flex-grow-1 ms-5 ">
                                <div className="p-3 badge-primary d-flex align-items-center justify-content-center rounded-4">
                                  <i
                                    className="fas fa-shopping-cart fs-4"
                                    style={{ color: "#004D40" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 mb-4 mb-lg-0">
                        <div
                          className="rounded shadow p-2"
                          style={{
                            backgroundColor: "#e9c46a",
                            height: 120,
                          }}
                        >
                          <div className="card-body h-100">
                            <div className="d-flex align-items-center justify-between h-100">
                              <div className="">
                                <p className="mb-1">Pending Delivery</p>
                                <h2 className="mb-0">
                                  {statusCounts.pending || 0}
                                  <span
                                    className=""
                                    style={{
                                      fontSize: "0.875rem",
                                    }}
                                  ></span>
                                </h2>
                              </div>
                              <div className="flex-grow-1 ms-5">
                                <div className="p-3 d-flex align-items-center justify-content-center badge-primary rounded-4">
                                  <i
                                    className="fas fa-clock fs-4"
                                    style={{ color: "#6200EA" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-4 mb-4 mb-lg-0">
                        <div
                          className="rounded shadow p-2"
                          style={{
                            backgroundColor: "#e76f51",
                            height: 120,
                          }}
                        >
                          <div className="card-body h-100">
                            <div className="d-flex align-items-center justify-between h-100">
                              <div className="">
                                <p className="mb-1">Fulfilled Orders</p>
                                <h2 className="mb-0">
                                  {statusCounts.fullfilled || 0}
                                  <span
                                    className=""
                                    style={{
                                      fontSize: "0.875rem",
                                    }}
                                  ></span>
                                </h2>
                              </div>
                              <div className="flex-grow-1 ms-5">
                                <div className="p-3 badge-primary rounded-4">
                                  <i
                                    className="fas fa-check-circle fs-4"
                                    style={{ color: "#01579B" }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Section: Orders List */}
                  <section className="">
                    <div className="row rounded shadow p-3">
                      <div className="col-lg-12 mb-4 mb-lg-0 h-100">
                        <table className="table align-middle mb-0 bg-white">
                          <thead className="bg-light">
                            <tr>
                              <th>Order ID</th>
                              <th>Payment Status</th>
                              <th>Order Status</th>
                              <th>Total</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {isLoading ? (
                              <>
                                <h5 className="mt-5 text-center text-info">
                                  Loading Orders...{" "}
                                  <i className="fas fa-spinner fa-spin loading-icon text-info"></i>
                                </h5>
                              </>
                            ) : (
                              <>
                                {orders.map((o, index) => (
                                  <tr key={o.oid}>
                                    <td>
                                      <p className="fw-bold mb-1">#{o.oid} </p>
                                      <p className="text-muted mb-0">
                                        {moment(o.date).format("MMM Do YYYY")}
                                      </p>
                                    </td>
                                    <td>
                                      <p className="fw-normal mb-1">
                                        {o.payment_status.toUpperCase()}
                                      </p>
                                    </td>
                                    <td>
                                      <p className="fw-normal mb-1">
                                        {o.order_status.toUpperCase()}
                                      </p>
                                    </td>
                                    <td>
                                      <span className="fw-normal mb-1">
                                        {o.total}
                                      </span>
                                    </td>
                                    <td>
                                      <Link
                                        to={`/customer/orders/${o.oid}/`}
                                        className="btn btn-link btn-sm btn-rounded"
                                      >
                                        View <i className="fas fa-eye ps-1" />
                                      </Link>
                                      <Link
                                        to={`/customer/invoice/${o.oid}/`}
                                        className="btn btn-link btn-sm btn-rounded"
                                      >
                                        Invoice{" "}
                                        <i className="fas fa-file-invoice ps-1" />
                                      </Link>
                                    </td>
                                  </tr>
                                ))}
                              </>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <canvas id="myChart" style={{ width: "100%" }} />
                    </div>
                  </section>
                </div>
              </main>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Orders;
