import React from "react";
import Sidebar from "../vendor/Sidebar";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import { Line } from "react-chartjs-2";
import { Chart } from "chart.js/auto";

function Dashboard() {
  const [stats, setStats] = useState({});
  const [orderChartData, setOrderChartData] = useState([]);
  const [productChartData, setProductChartData] = useState([]);
  const [products, setProducts] = useState([]);

  // Fetching Products
  const fetchProductList = async () => {
    const product_response = await apiInstance.get(
      `vendor/products/${UserData()?.vendor_id}/`
    );
    setProducts(product_response.data);
  };

  // Fetching Order Chart Data
  const fetchOrderChartData = async () => {
    const order_response = await apiInstance.get(
      `/vendor-orders-chart/${UserData()?.vendor_id}/`
    );
    setOrderChartData(order_response.data);
  };

  // Fetching Product Chart Data
  const fetchProductChartData = async () => {
    const order_response = await apiInstance.get(
      `/vendor-product-chart/${UserData()?.vendor_id}/`
    );
    setProductChartData(order_response.data);
  };

  // Fetching Order Chart, Product Chart Data, Product List
  useEffect(() => {
    fetchOrderChartData();
    fetchProductChartData();
    fetchProductList();
  }, []);
  console.log("Product List ===== ", products);

  // Fetching Order Stats Data
  useEffect(() => {
    apiInstance
      .get(`/vendor/stats/${UserData()?.vendor_id}/`)
      .then((res) => {
        setStats(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const order_months = orderChartData?.map((item) => item.month);
  const order_counts = orderChartData?.map((item) => item.orders);

  const product_months = productChartData?.map((item) => item.month);
  const product_counts = productChartData?.map((item) => item.products);

  const order_data = {
    labels: order_months,
    datasets: [
      {
        label: "Total Orders",
        data: order_counts,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const product_data = {
    labels: product_months,
    datasets: [
      {
        label: "Total Products",
        data: product_counts,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.2)",
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };
  console.log("Stats ===== ", stats);
  return (
    <div className="container-fluid" id="main">
      <div className="row row-offcanvas row-offcanvas-left h-100">
        <Sidebar />
        <div className="col-md-9 col-lg-10 main mt-4">
          <div className="row mb-3">
            <div className="col-xl-3 col-lg-6 mb-2">
              <div className="card card-inverse card-success">
                <div className="card-block bg-success p-3">
                  <div className="rotate">
                    <i className="bi bi-grid fa-5x" />
                  </div>
                  <h6 className="text-uppercase">Products</h6>
                  <h1 className="display-1">{stats.products}</h1>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 mb-2">
              <div className="card card-inverse card-danger">
                <div className="card-block bg-danger p-3">
                  <div className="rotate">
                    <i className="bi bi-cart-check fa-5x" />
                  </div>
                  <h6 className="text-uppercase">Orders</h6>
                  <h1 className="display-1">{stats.orders}</h1>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 mb-2">
              <div className="card card-inverse card-info">
                <div className="card-block bg-info p-3">
                  <div className="rotate">
                    <i className="bi bi-people fa-5x" />
                  </div>
                  <h6 className="text-uppercase">Customers</h6>
                  <h1 className="display-1">{stats.orders}</h1>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-6 mb-2">
              <div className="card card-inverse card-warning">
                <div className="card-block bg-warning p-3">
                  <div className="rotate">
                    <i className="bi bi-currency-dollar fa-5x" />
                  </div>
                  <h6 className="text-uppercase">Revenue</h6>
                  <h1 className="display-1">${stats.revenue}</h1>
                </div>
              </div>
            </div>
          </div>
          {/*/row*/}
          <hr />
          <div className="container">
            <div className="row my-3">
              <div className="col">
                <h4>Chart Analytics</h4>
              </div>
            </div>
            <div className="row my-2">
              <div className="col-md-6 py-1">
                <div className="card">
                  <div className="card-body">
                    <Line data={order_data} style={{ height: 300 }} />
                  </div>
                </div>
              </div>
              <div className="col-md-6 py-1">
                <div className="card">
                  <div className="card-body">
                    <Line data={product_data} style={{ height: 300 }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <a id="layouts" />
          <hr />
          <div className="row mb-3 container">
            <div className="col-lg-12" style={{ marginBottom: 100 }}>
              {/* Nav tabs */}
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    href="#home1"
                    role="tab"
                    data-toggle="tab"
                  >
                    Products
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    href="#profile1"
                    role="tab"
                    data-toggle="tab"
                  >
                    Orders
                  </a>
                </li>
              </ul>
              {/* Products List */}
              <div className="tab-content">
                <br />
                <div role="tabpanel" className="tab-pane active" id="home1">
                  <h4>Products</h4>
                  <table className="table">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">#ID</th>
                        <th scope="col">#Image</th>
                        <th scope="col">Name</th>
                        <th scope="col">Price</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Orders</th>
                        <th scope="col">Status</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products?.map((p, index) => (
                        <tr key={p.id}>
                          <th scope="row">#{p.id}</th>

                          <td>
                            <img
                              src={p.image}
                              alt={p.title}
                              style={{
                                height: 70,
                                width: 100,
                                objectFit: "cover",
                                borderRadius: "10px",
                              }}
                            ></img>
                          </td>
                          <td>{p.title}</td>
                          <td>${p.price}</td>
                          <td>{p.stock_qty}</td>
                          <td>{p.orders}</td>
                          <td>{p.status.toUpperCase()}</td>
                          <td>
                            <Link href="" className="btn btn-primary mb-1 me-2">
                              <i className="fas fa-eye" />
                            </Link>
                            <Link href="" className="btn btn-success mb-1 me-2">
                              <i className="fas fa-edit" />
                            </Link>
                            <Link href="" className="btn btn-danger mb-1 me-2">
                              <i className="fas fa-trash" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div role="tabpanel" className="tab-pane" id="profile1">
                  <h4>Orders</h4>
                  <table className="table">
                    <thead className="table-dark">
                      <tr>
                        <th scope="col">#Order ID</th>
                        <th scope="col">Total</th>
                        <th scope="col">Payment Status</th>
                        <th scope="col">Delivery Status</th>
                        <th scope="col">Date</th>
                        <th scope="col">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <th scope="row">#trytrr</th>
                        <td>$100.90</td>
                        <td>Paid</td>
                        <td>Shipped</td>
                        <td>20th June, 2023</td>
                        <td>
                          <a href="" className="btn btn-primary mb-1">
                            <i className="fas fa-eye" />
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">#hjkjhkhk</th>
                        <td>$210.90</td>
                        <td>Pending</td>
                        <td>Not Shipped</td>
                        <td>21th June, 2023</td>
                        <td>
                          <a href="" className="btn btn-primary mb-1">
                            <i className="fas fa-eye" />
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row">#retrey</th>
                        <td>$260.90</td>
                        <td>Failed</td>
                        <td>Not Shipped</td>
                        <td>25th June, 2023</td>
                        <td>
                          <a href="" className="btn btn-primary mb-1">
                            <i className="fas fa-eye" />
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
