import React from "react";
import Sidebar from "./Sidebar";
import apiInstance from "../../utils/axios";
import { useEffect, useState } from "react";
import UserData from "../plugin/UserData";
import Swal from "sweetalert2";
import moment from "moment";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

function CustomerNotification() {
  const [notifications, setNotifications] = useState([]);
  const userData = UserData();
  const [loading, setLoading] = useState(true);

  const fetchNotifications = () => {
    apiInstance
      .get(`/customer/notification/${userData?.user_id}/`)
      .then((res) => {
        setNotifications(res.data);
        console.log(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch notifications:", error);
      });
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markNotificationAsSeen = (notiId) => {
    apiInstance
      .get(`/customer/notification/${userData?.user_id}/${notiId}/`)
      .then((res) => {
        fetchNotifications();
        Toast.fire({
          icon: "success",
          title: "Notification marked as seen",
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <main className="mt-5">
      <div className="container">
        <section className="">
          <div className="row">
            {/* Sidebar Here */}
            <Sidebar />
            <div className="col-lg-9 mt-1">
              <section className="">
                <main className="mb-5" style={{}}>
                  <div className="container px-4">
                    <section className="">
                      <h3 className="mb-3">
                        <i className="fas fa-bell" /> Notifications{" "}
                      </h3>
                      {/* Notifications Loop */}
                      <div className="list-group">
                        {loading ? (
                          <>
                            <h5 className="mt-5 text-center text-info">
                              Loading Notifications...{" "}
                              <i className="fas fa-spinner fa-spin loading-icon text-info"></i>
                            </h5>
                          </>
                        ) : (
                          <>
                            {notifications?.map((n, index) => (
                              <a
                                href="#"
                                className="list-group-item list-group-item-action"
                                key={n.id}
                              >
                                <div className="d-flex w-100 justify-content-between">
                                  <h5 className="mb-1">Order Confirmed</h5>
                                  <small className="text-muted">
                                    {moment(n.date).format("MMM Do YYYY")}
                                  </small>
                                </div>
                                <p className="mb-1">
                                  Your order has been confirmed
                                </p>

                                <button
                                  className="btn btn-success mt-3"
                                  onClick={() => markNotificationAsSeen(n.id)}
                                >
                                  <i className="fas fa-eye"></i>
                                </button>
                              </a>
                            ))}
                            {notifications.length === 0 && (
                              <h4 className="p-4">
                                No New Notifications Available{" "}
                              </h4>
                            )}
                          </>
                        )}
                      </div>
                    </section>
                  </div>
                </main>
              </section>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default CustomerNotification;
