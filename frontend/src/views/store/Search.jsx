import React, { useState, useEffect } from "react";
import apiInstance from "../../utils/axios";
import { Link, useSearchParams } from "react-router-dom";
import GetCurrentAddress from "../plugin/UserCountry";
import UserData from "../plugin/UserData";
import CartID from "../plugin/CardID";
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

function Search() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [selectedQuantity, setSelectedQuantity] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [selectedSizes, setSelectedSizes] = useState({});

  const [searchParams] = useSearchParams();
  const query = searchParams.get("query");

  const fetchProducts = async () => {
    await apiInstance.get(`/search/?query=${query}`).then((response) => {
      setProducts(response.data);
      setProductsLoading(false);
    });
  };

  useEffect(() => {
    apiInstance.get(`category/`).then((response) => {
      setCategory(response.data);
    });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [query]);

  const handleColorButtonClick = (event, product_id, color_name) => {
    setSelectedColors((prevSelectedColors) => ({
      ...prevSelectedColors,
      [product_id]: color_name,
    }));
  };

  const handleSizeButtonClick = (event, product_id, size_name) => {
    setSelectedSizes((prevSelectedSize) => ({
      ...prevSelectedSize,
      [product_id]: size_name,
    }));
  };

  const handleQuantityChange = (event, product_id) => {
    const newQuantity = event.target.value;
    setSelectedQuantity((prevSelectedQuantity) => ({
      ...prevSelectedQuantity,
      [product_id]: newQuantity,
    }));
  };

  const currentAddress = GetCurrentAddress();
  const userData = UserData();
  const cart_id = CartID();

  const handleAddToCart = async (product_id, price, shipping_amount) => {
    const formData = new FormData();
    formData.append("product_id", product_id);
    formData.append("shipping_amount", shipping_amount);
    formData.append("price", price);
    formData.append("user_id", userData?.user_id);
    formData.append("country", currentAddress.country);
    formData.append("cart_id", cart_id);
    formData.append("qty", selectedQuantity[product_id] || 1);
    formData.append("size", selectedSizes[product_id] || "No Size");
    formData.append("color", selectedColors[product_id] || "No Color");

    const response = await apiInstance.post(`cart-view/`, formData);
    console.log(response.data);

    Toast.fire({
      icon: "success",
      title: response.data.message,
    });
  };

  return (
    <>
      {" "}
      {/*Main layout*/}
      <main className="mt-5">
        <div className="container">
          <section className="text-center">
            {/* Products START */}
            {productsLoading && (
              <h5 className="mt-5 text-center text-info">
                Loading {query} Products ...{" "}
                <i className="fas fa-spinner fa-spin loading-icon"></i>
              </h5>
            )}
            {!productsLoading && (
              <div className="row">
                {products?.map((p, index) => (
                  <div key={p.id} className="col-lg-4 col-md-12 mb-4">
                    <div className="card">
                      <div
                        className="bg-image hover-zoom ripple"
                        data-mdb-ripple-color="light"
                      >
                        <Link to={`/detail/${p.slug}`}>
                          <img
                            src={p.image}
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
                        <Link to={`/detail/${p.slug}`} className="text-reset">
                          <h5 className="card-title mb-3">{p.title}</h5>
                        </Link>

                        <Link to={`/detail/${p.slug}`}>
                          <p>{p.category?.title}</p>
                        </Link>
                        <div className="d-flex justify-content-center">
                          <h6 className="mb-3">${p.price}</h6>
                          <h6 className="mb-3 text-muted ms-2">
                            <strike>${p.old_price}</strike>
                          </h6>
                        </div>

                        {/* Variation and Heart START */}
                        <div className="btn-group">
                          <button
                            className="btn btn-primary dropdown-toggle"
                            type="button"
                            id="dropdownMenuClickable"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="false"
                            aria-expanded="false"
                          >
                            Variation
                          </button>
                          <ul
                            className="dropdown-menu"
                            aria-labelledby="dropdownMenuClickable"
                          >
                            {/*  Product Quantity START */}
                            <div className="d-flex flex-column">
                              <li className="p-1">
                                <b className="pe-1">Quantity:</b>
                                {}
                              </li>
                              <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                <li key={index}>
                                  <input
                                    className="form-control"
                                    type="number"
                                    min="1"
                                    value={selectedQuantity[p.id] || 1} // This ensures the input displays the current quantity from the state
                                    onChange={(e) =>
                                      handleQuantityChange(e, p.id)
                                    }
                                  />
                                </li>
                              </div>
                            </div>
                            {/*  Product Quantity END */}

                            {/* Product Sizes START */}
                            {p.size?.length > 0 && (
                              <div className="d-flex flex-column">
                                <li className="p-1">
                                  <b className="pe-1">Size:</b>
                                  {selectedSizes[p.id] || "No Size"}
                                </li>
                                <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                  {p.size?.map((size, index) => (
                                    <li key={index}>
                                      <button
                                        onClick={(e) =>
                                          handleSizeButtonClick(
                                            e,
                                            p.id,
                                            size.name
                                          )
                                        }
                                        className="btn btn-secondary btn-sm me-2 mb-1"
                                      >
                                        {size.name}
                                      </button>
                                    </li>
                                  ))}
                                </div>
                              </div>
                            )}
                            {/* Product Sizes END */}

                            {/* Product Colors START */}
                            {p.color?.length > 0 && (
                              <div className="mt-3">
                                <li className="p-1">
                                  <b className="pe-1">Color:</b>
                                  {selectedColors[p.id] || "No Color"}
                                </li>
                                <ul className="list-unstyled d-flex flex-wrap">
                                  {p.color?.map((color, index) => (
                                    <li key={index} className="p-1">
                                      <button
                                        className="btn btn-sm me-2 mb-1 p-3"
                                        style={{
                                          backgroundColor: color.color_code,
                                        }}
                                        onClick={(e) =>
                                          handleColorButtonClick(
                                            e,
                                            p.id,
                                            color.name
                                          )
                                        }
                                      />
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {/* Product Colors END */}

                            {/* Add to Cart / Wishlist Btn Start */}
                            <div className="d-flex mt-3 p-1">
                              <button
                                type="button"
                                className="btn btn-primary me-1 mb-1"
                                onClick={() =>
                                  handleAddToCart(
                                    p.id,
                                    p.price,
                                    p.shipping_amount
                                  )
                                }
                              >
                                <i className="fas fa-shopping-cart" />
                              </button>
                              <button
                                type="button"
                                className="btn btn-danger px-3 me-1 mb-1 ms-2"
                              >
                                <i className="fas fa-heart" />
                              </button>
                            </div>
                            {/* Add to Cart / Wishlist Btn END */}
                          </ul>
                          <span>
                            <button
                              type="button"
                              className="btn btn-danger px-3 me-1 ms-2"
                            >
                              <i className="fas fa-heart" />
                            </button>
                          </span>
                        </div>
                        {/* Variation and Heart END */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {/* Products END */}

            {/* Categories START*/}
            <div className="row">
              {category?.map((c, index) => (
                <div key={c.id} className="col-lg-2">
                  <img
                    src={c.image}
                    style={{
                      width: "100px",
                      height: "100px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                    alt=""
                  />
                  <h6>{c.title}</h6>
                </div>
              ))}
            </div>
            {/* Categories END */}
          </section>
          {/*Section: Wishlist*/}
        </div>
      </main>
    </>
  );
}

export default Search;
