import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import apiInstance from "../../utils/axios";
import GetCurrentAddress from "../plugin/UserCountry";
import UserData from "../plugin/UserData";
import CartID from "../plugin/CardID";
import moment from "moment";
import Swal from "sweetalert2";
import { CartContext } from "../plugin/Context";

function ProductDetail() {
  const [product, setProduct] = useState({}); // Product details
  const [specifications, setSpecifications] = useState([]); // Product specifications
  const [gallery, setGallery] = useState([]); // Gallery images
  const [colors, setColors] = useState([]); // Product colors
  const [sizes, setSizes] = useState([]); // Product sizes
  const [reviews, setReviews] = useState([]); // Product reviews
  const [createReview, setCreateReview] = useState({
    user_id: 0,
    product_id: product.id,
    review: "",
    rating: 0,
  }); // Review form data

  // Global State for cart count
  const [cartCount, setCartCount] = useContext(CartContext);

  const [colorValue, setColorValue] = useState("No Color"); // Selected color
  const [sizeValue, setSizeValue] = useState("No Size"); // Selected size
  const [quantityValue, setQuantityValue] = useState(1); // Selected quantity

  const param = useParams();
  const currentAddress = GetCurrentAddress();

  const userData = UserData();
  const cartID = CartID();

  const Toast = Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });

  useEffect(() => {
    apiInstance.get(`/products/${param.slug}`).then((res) => {
      setProduct(res.data);
      setSpecifications(res.data.specification);
      setGallery(res.data.gallery);
      setColors(res.data.color);
      setSizes(res.data.size);
    });
  }, []);

  const handleColorButtonClick = (event) => {
    const colorNameInput = event.target
      .closest(".color_button")
      .parentNode.querySelector(".color_name");
    setColorValue(colorNameInput.value);
  };

  const handleSizeButtonClick = (event) => {
    const sizeNameInput = event.target
      .closest(".size_button")
      .parentNode.querySelector(".size_name");
    setSizeValue(sizeNameInput.value);
  };

  const handleQuantityChange = (event) => {
    setQuantityValue(event.target.value);
  };

  const handleAddToCart = async () => {
    console.log(currentAddress.country);
    try {
      const formData = new FormData();
      formData.append("product_id", product.id);
      formData.append("user_id", userData?.user_id);
      formData.append("qty", quantityValue);
      formData.append("price", product.price);
      formData.append("shipping_amount", product.shipping_amount);
      formData.append("country", currentAddress.country);
      formData.append("size", sizeValue);
      formData.append("color", colorValue);
      formData.append("cart_id", cartID);

      // Send a POST request to add product to cart
      await apiInstance.post(`cart-view/`, formData);

      // Fetch updated cart items
      const url = userData
        ? `/cart-list/${cartID}/${userData?.user_id}`
        : `/cart-list/${cartID}`;
      apiInstance.get(url).then((res) => {
        setCartCount(res.data.length);
      });
      Toast.fire({
        icon: "success",
        title: "Product added to cart",
      });
    } catch (error) {
      console.error("Failed to add product to cart:", error);
      Toast.fire({
        icon: "error",
        title: "Failed to add product to cart",
      });
    }
  };

  const fetchReviewData = async () => {
    try {
      if (product && product.id) {
        // Check if product and product.id are not null or undefined
        const response = await apiInstance.get(`reviews/${product.id}`);
        console.log("Response Data from fetchReviewData", response.data);
        setReviews(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch review data:", error);
    }
  };

  useEffect(() => {
    fetchReviewData();
  }, [product]);

  const handleReviewChange = (event) => {
    setCreateReview({
      ...createReview,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    console.log("Create Review Data", createReview);
  }, [createReview]);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    try {
      if (!userData) {
        Toast.fire({
          icon: "info",
          title: "Please login to submit a review",
        });
      }
      const formData = new FormData();
      formData.append("user_id", userData?.user_id);
      formData.append("product_id", product.id);
      formData.append("review", createReview.review);
      formData.append("rating", createReview.rating);

      const response = await apiInstance.post(
        `reviews/${product.id}/`,
        formData
      );
      console.log("Review Submitted", response.data);
      Toast.fire({
        icon: "success",
        title: "Review submitted successfully",
      });
      fetchReviewData();
    } catch (error) {
      console.error("Failed to submit review:", error);
      Toast.fire({
        icon: "error",
        title: "Failed to submit review",
      });
    }
  };

  console.log("Product", product);

  return (
    <main className="mb-4 mt-4">
      <div className="container">
        {/* Section: Product details START*/}
        <section className="mb-9">
          <div className="row gx-lg-5">
            <div className="col-md-6 mb-4 mb-md-0">
              {/* Gallery  START*/}
              <div className="">
                {/* Main Image */}
                <div className="row gx-2 gx-lg-3">
                  <div className="col-12 col-lg-12">
                    <div className="lightbox">
                      <img
                        src={product.image}
                        style={{
                          width: "100%",
                          height: 500,
                          objectFit: "cover",
                          borderRadius: 10,
                        }}
                        alt="Gallery image 1"
                        className="ecommerce-gallery-main-img active w-100 rounded-4"
                      />
                    </div>
                  </div>
                </div>
                {/* Gallery Images */}
                <div className="mt-3 d-flex">
                  {gallery.map((g, index) => (
                    <div key={g.id} className="p-3">
                      <img
                        src={g.image}
                        style={{
                          width: 100,
                          height: 100,
                          objectFit: "cover",
                          borderRadius: 10,
                        }}
                        alt="Gallery image 1"
                        className="ecommerce-gallery-main-img active w-100 rounded-4"
                      />
                    </div>
                  ))}
                </div>
              </div>
              {/* Gallery  END*/}
            </div>
            <div className="col-md-6 mb-4 mb-md-0">
              {/* Details */}
              <div>
                <h1 className="fw-bold mb-3">{product.title}</h1>
                <div className="d-flex text-primary just align-items-center">
                  {/* Rating Stars */}
                  <ul className="mb-3 d-flex p-0" style={{ listStyle: "none" }}>
                    <li>
                      {[...Array(5)].map((_, index) => (
                        <i
                          key={index}
                          className={`fa fa-star fa-sm ${index < product?.product_rating ? "text-warning" : "text-dark"} ps-0`}
                          title={
                            index < product?.product_rating
                              ? "Rated"
                              : "Not Rated"
                          }
                        />
                      ))}
                    </li>

                    <li style={{ marginLeft: 10, fontSize: 13 }}>
                      <span href="" className="text-decoration-none">
                        <strong className="me-2">
                          {product?.rating_count > 0
                            ? `${product?.product_rating}/5`
                            : "0/5"}
                        </strong>
                        ({product?.rating_count} reviews)
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Pricing */}
                <h5 className="mb-3">
                  <s className="text-muted me-2 small align-middle">
                    ${product.old_price}
                  </s>
                  <span className="align-middle">${product.price}</span>
                </h5>
                <p className="text-muted">{product.description}</p>

                {/* Category and Specification START */}
                <div className="table-responsive">
                  <table className="table table-sm table-borderless mb-0">
                    <tbody>
                      <tr>
                        <th className="ps-0 w-25" scope="row">
                          <strong>Category</strong>
                        </th>
                        <td>{product.category?.title}</td>
                      </tr>

                      {specifications.map((s, index) => (
                        <tr key={s.id}>
                          <th className="ps-0 w-25" scope="row">
                            <strong>{s.title}</strong>
                          </th>
                          <td>{s.content}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* Category and Specification END */}

                <hr className="my-5" />

                {/* Size Colors Quantity Wshlisht Add Cart START*/}
                <div>
                  <div className="row flex-column">
                    {/* Quantity */}
                    <div className="col-md-6 mb-4">
                      <div className="form-outline">
                        <label className="form-label" htmlFor="typeNumber">
                          <b>Quantity:</b> <span>{quantityValue}</span>
                        </label>
                        <input
                          type="number"
                          id="typeNumber"
                          className="form-control quantity"
                          min={1}
                          value={quantityValue}
                          onChange={handleQuantityChange}
                        />
                      </div>
                    </div>

                    {/* Sizes */}
                    {sizes.length > 0 && (
                      <>
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="typeNumber">
                              <b>Size:</b> <span>{sizeValue}</span>
                            </label>
                          </div>
                          <div className="d-flex">
                            {sizes?.map((s, index) => (
                              <div key={s.id}>
                                <div className="me-3">
                                  <input
                                    type="hidden"
                                    className="size_name"
                                    value={s.name}
                                  />
                                  <button
                                    className="btn px-4 btn-secondary size_button"
                                    type="button"
                                    onClick={handleSizeButtonClick}
                                  >
                                    {s.name}
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                          <hr />
                        </div>
                      </>
                    )}

                    {/* Colors */}
                    {colors.length > 0 && (
                      <>
                        <div className="col-md-6 mb-4">
                          <div className="form-outline">
                            <label className="form-label" htmlFor="typeNumber">
                              <b>Color:</b> <span>{colorValue}</span>
                            </label>
                          </div>
                          <div className="d-flex">
                            {colors?.map((c, index) => (
                              <div key={c.id} className="me-2">
                                <input
                                  type="hidden"
                                  className="color_name"
                                  value={c.name}
                                />
                                <button
                                  className="btn p-3 me-2 color_button"
                                  type="button"
                                  onClick={handleColorButtonClick}
                                  style={{
                                    backgroundColor: c.color_code,
                                  }}
                                ></button>
                              </div>
                            ))}
                          </div>
                          <hr />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Add to Cart Btn Start */}
                  <button
                    type="button"
                    className="btn btn-primary btn-rounded me-2"
                    onClick={handleAddToCart}
                  >
                    <i className="fas fa-cart-plus me-2" /> Add to cart
                  </button>
                  {/* Add to Cart Btn End */}

                  {/* Add to Wishlist Btn Start */}
                  <button
                    href="#!"
                    type="button"
                    className="btn btn-danger btn-floating"
                    data-mdb-toggle="tooltip"
                    title="Add to wishlist"
                  >
                    <i className="fas fa-heart" />
                  </button>
                  {/* Add to Wishlist Btn End */}
                </div>
                {/* Size Colors Quantity Wshlisht Add Cart END*/}
              </div>
            </div>
          </div>
        </section>
        {/* Section: Product details END */}

        <hr />

        {/* Tab List START */}
        <ul className="nav nav-pills mb-3 mx-1" id="pills-tab" role="tablist">
          <li className="nav-item nav-item-2" role="presentation">
            <button
              className="btn btn-primary nav-link active"
              id="pills-home-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-home"
              type="button"
              role="tab"
              aria-controls="pills-home"
              aria-selected="true"
            >
              Specifications
            </button>
          </li>
          <li className="nav-item nav-item-2" role="presentation">
            <button
              className="nav-link"
              id="pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-profile"
              type="button"
              role="tab"
              aria-controls="pills-profile"
              aria-selected="false"
            >
              Vendor
            </button>
          </li>
          <li className="nav-item nav-item-2" role="presentation">
            <button
              className="nav-link"
              id="pills-contact-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-contact"
              type="button"
              role="tab"
              aria-controls="pills-contact"
              aria-selected="false"
            >
              Review
            </button>
          </li>
        </ul>
        {/* Tab List END */}

        {/* Tab List Content Start */}
        <div className="tab-content" id="pills-tabContent">
          {/* Category and Specification START */}
          <div
            className="tab-pane fade show active"
            id="pills-home"
            role="tabpanel"
            aria-labelledby="pills-home-tab"
            tabIndex={0}
          >
            <div className="table-responsive">
              <table className="table table-sm table-borderless mb-0">
                <tbody>
                  <tr>
                    <th className="ps-0 w-25" scope="row">
                      <strong>Category</strong>
                    </th>
                    <td>{product.category?.title}</td>
                  </tr>

                  {specifications.map((s, index) => (
                    <tr key={s.id}>
                      <th className="ps-0 w-25" scope="row">
                        <strong>{s.title}</strong>
                      </th>
                      <td>{s.content}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Category and Specification END */}

          {/* Vendor START */}

          <div
            className="tab-pane fade"
            id="pills-profile"
            role="tabpanel"
            aria-labelledby="pills-profile-tab"
            tabIndex={0}
          >
            <div className="card mb-3" style={{ maxWidth: 400 }}>
              <div className="row g-0">
                <div className="col-md-4">
                  <img
                    src={product?.vendor?.image}
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                    alt="User Image"
                    className="img-fluid"
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title">{product?.vendor?.name}</h5>
                    <p className="card-text">{product?.vendor?.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Vendor END */}

          {/* Review START */}
          <div
            className="tab-pane fade"
            id="pills-contact"
            role="tabpanel"
            aria-labelledby="pills-contact-tab"
            tabIndex={0}
          >
            <div className="container mt-5">
              <div className="row">
                {/* Column 1: Form to create a new review */}
                <div className="col-md-6">
                  <h2>Create a New Review</h2>
                  <form onSubmit={handleReviewSubmit}>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        Rating
                      </label>
                      <select
                        name="rating"
                        className="form-select"
                        id=""
                        onChange={handleReviewChange}
                      >
                        <option value="1">1 Star</option>
                        <option value="2">2 Star</option>
                        <option value="3">3 Star</option>
                        <option value="4">4 Star</option>
                        <option value="5">5 Star</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="reviewText" className="form-label">
                        Review
                      </label>
                      <textarea
                        name="review"
                        className="form-control"
                        id="reviewText"
                        rows={4}
                        placeholder="Write your review"
                        value={createReview.review}
                        onChange={handleReviewChange}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Submit Review
                    </button>
                  </form>
                </div>

                {/* Column 2: Display existing reviews */}
                <div className="col-md-6">
                  <h2>Existing Reviews</h2>
                  <div className="">
                    {reviews.map((r, index) => (
                      <div key={r.id} className="border p-2 mb-2 row g-0">
                        <div className="col-md-3">
                          <img
                            src={r.profile?.image}
                            alt="Profile Image"
                            className="img-fluid"
                          />
                        </div>
                        <div className="col-md-9">
                          <div className="ps-4">
                            <h5 className="card-title">{r.user?.full_name}</h5>
                            <p className="card-text">
                              {moment(r.date).format("MMM D, YYYY")}
                            </p>
                            <p className="card-text">{r.review}</p>

                            {[...Array(5)].map((_, index) => (
                              <i
                                key={index}
                                className={`fa fa-star fa-sm ${index < r?.rating ? "text-warning" : "text-dark"} ps-0`}
                                title={
                                  index < product?.rating
                                    ? "Rated"
                                    : "Not Rated"
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Review END */}

          {/* Question Start */}
          <div
            className="tab-pane fade"
            id="pills-disabled"
            role="tabpanel"
            aria-labelledby="pills-disabled-tab"
            tabIndex={0}
          >
            <div className="container mt-5">
              <div className="row">
                {/* Column 1: Form to submit new questions */}
                <div className="col-md-6">
                  <h2>Ask a Question</h2>
                  <form>
                    <div className="mb-3">
                      <label htmlFor="askerName" className="form-label">
                        Your Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="askerName"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="questionText" className="form-label">
                        Question
                      </label>
                      <textarea
                        className="form-control"
                        id="questionText"
                        rows={4}
                        placeholder="Ask your question"
                        defaultValue={""}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">
                      Submit Question
                    </button>
                  </form>
                </div>
                {/* Column 2: Display existing questions and answers */}
                <div className="col-md-6">
                  <h2>Questions and Answers</h2>
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">User 1</h5>
                      <p className="card-text">August 10, 2023</p>
                      <p className="card-text">
                        What are the available payment methods?
                      </p>
                      <h6 className="card-subtitle mb-2 text-muted">Answer:</h6>
                      <p className="card-text">
                        We accept credit/debit cards and PayPal as payment
                        methods.
                      </p>
                    </div>
                  </div>
                  <div className="card mb-3">
                    <div className="card-body">
                      <h5 className="card-title">User 2</h5>
                      <p className="card-text">August 15, 2023</p>
                      <p className="card-text">How long does shipping take?</p>
                      <h6 className="card-subtitle mb-2 text-muted">Answer:</h6>
                      <p className="card-text">
                        Shipping usually takes 3-5 business days within the US.
                      </p>
                    </div>
                  </div>
                  {/* More questions and answers can be added here */}
                </div>
              </div>
            </div>
          </div>
          {/* Question End */}
        </div>
        {/* Tab List Content End */}
      </div>
    </main>
  );
}

export default ProductDetail;
