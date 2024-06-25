import React from "react";
import Sidebar from "./Sidebar";
import apiInstance from "../../utils/axios";
import { useState, useEffect } from "react";
import UserData from "../plugin/UserData";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const userData = UserData();
  const [loading, setLoading] = useState(true);
  const fetchWishlist = async () => {
    try {
      const response = await apiInstance.get(
        `customer/wishlist/${userData?.user_id}/`
      );
      setWishlist(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const addToWishlist = async (productId, userId) => {
    try {
      const formdata = new FormData();
      formdata.append("product_id", productId);
      formdata.append("user_id", userId);
      const response = await apiInstance.post(
        `customer/wishlist/${userId}/`,
        formdata
      );
      Toast.fire({
        icon: "success",
        title: response.data.message,
      });
      fetchWishlist();
    } catch (error) {
      console.log(error);
    }
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
                  <div className="container">
                    <section className="">
                      <div className="row">
                        <h3 className="mb-3">
                          <i className="fas fa-heart text-danger" /> Wishlist
                        </h3>
                        {loading ? (
                          <>
                            <h5 className="mt-5 text-center text-info">
                              Loading Wishlist...{" "}
                              <i className="fas fa-spinner fa-spin loading-icon text-info"></i>
                            </h5>
                          </>
                        ) : (
                          <>
                            {wishlist?.map((w, index) => (
                              <div
                                key={w.product?.id}
                                className="col-lg-4 col-md-12 mb-4"
                              >
                                <div className="card">
                                  <div
                                    className="bg-image hover-zoom ripple"
                                    data-mdb-ripple-color="light"
                                  >
                                    <Link to={`/detail/${w.product?.slug}`}>
                                      <img
                                        src={w.product?.image}
                                        className="w-100"
                                        style={{
                                          width: "100%",
                                          height: "250px",
                                          objectFit: "cover",
                                        }}
                                      />
                                    </Link>
                                  </div>
                                  <div className="card-body">
                                    <Link
                                      to={`/detail/${w.product?.slug}`}
                                      className="text-reset"
                                    >
                                      <h5 className="card-title mb-3">
                                        {w.product?.title}
                                      </h5>
                                    </Link>

                                    <Link to={`/detail/${w.product?.slug}`}>
                                      <p>{w.product?.category?.title}</p>
                                    </Link>
                                    <div className="d-flex">
                                      <h6 className="mb-3">
                                        ${w.product?.price}
                                      </h6>
                                      <h6 className="mb-3 text-muted ms-2">
                                        <strike>${w.product?.old_price}</strike>
                                      </h6>
                                    </div>

                                    {/* Heart START */}
                                    <div className="btn-group">
                                      <button
                                        type="button"
                                        className="btn btn-danger px-3 me-1 ms-2"
                                        onClick={() =>
                                          addToWishlist(
                                            w.product?.id,
                                            userData?.user_id
                                          )
                                        }
                                      >
                                        <i className="fas fa-heart" />
                                      </button>
                                    </div>
                                    {/* Variation and Heart END */}
                                  </div>
                                </div>
                              </div>
                            ))}

                            {wishlist.length === 0 && (
                              <h4 className="container p-4">
                                Your wishlist is Empty{" "}
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

export default Wishlist;
