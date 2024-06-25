import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import Sidebar from "./Sidebar";
import Swal from "sweetalert2";

function AddProduct() {
  const userData = UserData();

  const [product, setProduct] = useState({
    title: "",
    image: null,
    description: "",
    category: "",
    price: "",
    old_price: "",
    shipping_amount: "",
    stock_qty: "",
    vendor: userData?.vendor_id,
  });
  const [specifications, setSpecifications] = useState([
    {
      title: "",
      content: "",
    },
  ]);
  const [colors, setColors] = useState([
    {
      name: "",
      color_code: "",
    },
  ]);
  const [sizes, setSizes] = useState([
    {
      name: "",
      price: "",
    },
  ]);
  const [gallery, setGallery] = useState([{ image: "" }]);
  const [category, setCategory] = useState([]);

  const handleAddMore = (setStateFunction) => {
    setStateFunction((prevState) => [...prevState, {}]);
  };
  const handleRemove = (index, setStateFunction) => {
    setStateFunction((prevState) => {
      const newState = [...prevState];
      newState.splice(index, 1);
      return newState;
    });
  };
  const handleInputChange = (index, field, value, setStateFunction) => {
    setStateFunction((prevState) => {
      const newState = [...prevState];
      newState[index][field] = value;
      return newState;
    });
  };
  const handleImageChange = (index, event, setStateFunction) => {
    console.log("event ======== ", event.target.files[0]);
    const file = event.target.files[0];
    console.log("file ======== ", file);
    if (file) {
      const reader = new FileReader();
      console.log("Were in if block");

      reader.onloadend = () => {
        console.log("Were in reader block");
        if (reader.readyState === 2) {
          setStateFunction((prevState) => {
            const newState = [...prevState];
            newState[index].image = { file, preview: reader.result };
            return newState;
          });
        }
      };
      reader.readAsDataURL(file);
    } else {
      console.log("Were in else block");
      setStateFunction((prevState) => {
        const newState = [...prevState];
        newState[index].image = null;
        newState[index].preview = null;
        return newState;
      });
    }
  };
  const handleProductInputChange = (event) => {
    setProduct({ ...product, [event.target.name]: event.target.value });
  };
  const handleProductFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setProduct({
          ...product,
          image: { file: event.target.files[0], preview: reader.result },
        });
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    // Produktdaten hinzufügen
    Object.entries(product).forEach(([key, value]) => {
      if (key === "image" && value && value.file) {
        formData.append(key, value.file, value.file.name);
      } else {
        formData.append(key, value);
      }
    });

    // Nicht-leere Spezifikationen hinzufügen
    specifications.forEach((specification, index) => {
      if (specification.title && specification.content) {
        Object.entries(specification).forEach(([key, value]) => {
          formData.append(`specifications[${index}][${key}]`, value);
        });
      }
    });

    // Nicht-leere Farben hinzufügen
    colors.forEach((color, index) => {
      if (color.name && color.color_code) {
        Object.entries(color).forEach(([key, value]) => {
          formData.append(`colors[${index}][${key}]`, value);
        });
      }
    });

    // Nicht-leere Größen hinzufügen
    sizes.forEach((size, index) => {
      if (size.name && size.price) {
        Object.entries(size).forEach(([key, value]) => {
          formData.append(`sizes[${index}][${key}]`, value);
        });
      }
    });

    // Nicht-leere Galerie hinzufügen
    gallery.forEach((image, index) => {
      if (image.image && image.image.file) {
        formData.append(
          `gallery[${index}][image]`,
          image.image.file,
          image.image.file.name
        );
      }
    });

    // Log FormData content for debugging
    // for (let [key, value] of formData.entries()) {
    //     console.log(`${key}:`, value);
    // }

    try {
      const response = await apiInstance.post(
        "/vendor-create-product/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Product Created Successfully",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Something went wrong",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (error) {
      console.error("Error during form submission: ", error);
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  useEffect(() => {
    apiInstance.get("/category").then((response) => {
      setCategory(response.data);
    });
  }, []);

  return (
    <div className="container-fluid" id="main">
      <div className="row row-offcanvas row-offcanvas-left h-100">
        {/* Sidebar Here */}
        <Sidebar />
        <div className="col-md-9 col-lg-10 main mt-4">
          <div className="container">
            <form
              onSubmit={handleSubmit}
              encType="multipart/form-data"
              className="main-body"
            >
              <div className="tab-content" id="pills-tabContent">
                {/* Basic Info Tab */}
                <div
                  className="tab-pane fade show active"
                  id="pills-home"
                  role="tabpanel"
                  aria-labelledby="pills-home-tab"
                >
                  <div className="row gutters-sm shadow p-4 rounded">
                    <h4 className="mb-4">Product Details</h4>
                    <div className="col-md-12">
                      <div className="card mb-3">
                        <div className="card-body">
                          <div className="row text-dark">
                            <div className="col-lg-6 mb-2">
                              <label htmlFor="" className="mb-2">
                                Product Thumbnail
                              </label>
                              <input
                                type="file"
                                className="form-control"
                                name="image"
                                onChange={handleProductFileChange}
                              />
                            </div>
                            <div className="col-lg-6 mb-2 ">
                              <label htmlFor="" className="mb-2">
                                Name
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={product.title || " "}
                                onChange={handleProductInputChange}
                              />
                            </div>
                            <div className="col-lg-12 mb-2">
                              <label htmlFor="" className="mb-2">
                                Description
                              </label>
                              <textarea
                                className="form-control"
                                cols={30}
                                rows={10}
                                name="description"
                                value={product.description || " "}
                                onChange={handleProductInputChange}
                              />
                            </div>
                            <div className="col-lg-12 mb-2">
                              <label htmlFor="" className="mb-2">
                                Category
                              </label>
                              <select
                                className="select form-control"
                                name="category"
                                value={product.category || " "}
                                onChange={handleProductInputChange}
                              >
                                <option value="">- Select -</option>
                                {category.map((category) => (
                                  <option key={category.id} value={category.id}>
                                    {category.title}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="col-lg-6 mb-2 ">
                              <label htmlFor="" className="mb-2">
                                Sale Price
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="price"
                                value={product.price || " "}
                                onChange={handleProductInputChange}
                              />
                            </div>
                            <div className="col-lg-6 mb-2 ">
                              <label htmlFor="" className="mb-2">
                                Old Price
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="old_price"
                                value={product.old_price || " "}
                                onChange={handleProductInputChange}
                              />
                            </div>
                            <div className="col-lg-6 mb-2 ">
                              <label htmlFor="" className="mb-2">
                                Shipping Amount
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="shipping_amount"
                                value={product.shipping_amount | " "}
                                onChange={handleProductInputChange}
                              />
                            </div>
                            <div className="col-lg-6 mb-2 ">
                              <label htmlFor="" className="mb-2">
                                Stock Qty
                              </label>
                              <input
                                type="text"
                                className="form-control"
                                name="stock_qty"
                                value={product.stock_qty | " "}
                                onChange={handleProductInputChange}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Gallery Tab */}
                <div
                  className="tab-pane fade"
                  id="pills-profile"
                  role="tabpanel"
                  aria-labelledby="pills-profile-tab"
                >
                  <div className="row gutters-sm shadow p-4 rounded">
                    <h4 className="mb-4">Product Image</h4>
                    <div className="col-md-12">
                      <div className="card mb-3">
                        <div className="card-body">
                          {/* Gallery Images */}
                          {gallery.map((item, index) => (
                            <div key={index} className="row text-dark">
                              <div className="col-lg-6 mb-2">
                                {/* Image */}
                                {item.image && (
                                  <img
                                    src={item.image.preview || ""}
                                    className=""
                                    style={{
                                      width: "100%",
                                      height: "200px",
                                      objectFit: "cover",
                                      borderRadius: "5px",
                                    }}
                                  ></img>
                                )}{" "}
                                {/* Default Image */}
                                {!item.image && (
                                  <img
                                    src={
                                      "http://127.0.0.1:8000/media/default/default-image.png" ||
                                      ""
                                    }
                                    className=""
                                    style={{
                                      width: "100%",
                                      height: "200px",
                                      objectFit: "cover",
                                      borderRadius: "5px",
                                    }}
                                  ></img>
                                )}
                              </div>
                              {/* Image Input */}
                              <div className="col-lg-3 mb-2">
                                <label htmlFor="" className="">
                                  Product Image
                                </label>
                                <input
                                  type="file"
                                  className="form-control"
                                  onChange={(e) =>
                                    handleImageChange(index, e, setGallery)
                                  }
                                />
                              </div>
                              {/* Image Removal */}
                              <div className="col-lg-3 mb-2">
                                <button
                                  className="btn btn-danger mt-4"
                                  onClick={() =>
                                    handleRemove(index, setGallery)
                                  }
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                          {gallery.length === 0 && (
                            <h4>No Image Uploaded Yet.</h4>
                          )}

                          {/* Add Image Btn */}
                          <button
                            type="button"
                            className="btn btn-primary mt-5"
                            onClick={() => handleAddMore(setGallery)}
                          >
                            <i className="fas fa-plus" /> Add Image
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Specifications Tab */}
                <div
                  className="tab-pane fade"
                  id="pills-contact"
                  role="tabpanel"
                  aria-labelledby="pills-contact-tab"
                >
                  <div className="row gutters-sm shadow p-4 rounded">
                    <h4 className="mb-4">Specifications</h4>
                    <div className="col-md-12">
                      <div className="card mb-3">
                        <div className="card-body">
                          {specifications.map((specification, index) => (
                            <div
                              key={specification.id}
                              className="row text-dark"
                            >
                              <div className="col-lg-5 ">
                                <label htmlFor="" className="">
                                  Title
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "title",
                                      e.target.value,
                                      setSpecifications
                                    )
                                  }
                                />
                              </div>
                              <div className="col-lg-5 ">
                                <label htmlFor="" className="">
                                  Content
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "content",
                                      e.target.value,
                                      setSpecifications
                                    )
                                  }
                                />
                              </div>
                              <div className="col-lg-2">
                                <button
                                  type="button"
                                  className="btn btn-danger mt-4"
                                  onClick={() =>
                                    handleRemove(index, setSpecifications)
                                  }
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                          {specifications.length === 0 && (
                            <h4>No Specifications Added Yet.</h4>
                          )}
                          <button
                            type="button"
                            className="btn btn-primary mt-5"
                            onClick={() => handleAddMore(setSpecifications)}
                          >
                            <i className="fas fa-plus" /> Add Specifications
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Size Tab */}
                <div
                  className="tab-pane fade"
                  id="pills-size"
                  role="tabpanel"
                  aria-labelledby="pills-size-tab"
                >
                  <div className="row gutters-sm shadow p-4 rounded">
                    <h4 className="mb-4">Size</h4>
                    <div className="col-md-12">
                      <div className="card mb-3">
                        <div className="card-body">
                          {sizes.map((size, index) => (
                            <div key={size.id} className="row text-dark">
                              <div className="col-lg-5 ">
                                <label htmlFor="" className="">
                                  Size
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "name",
                                      e.target.value,
                                      setSizes
                                    )
                                  }
                                  value={size.name || " "}
                                />
                              </div>
                              <div className="col-lg-5 ">
                                <label htmlFor="" className="">
                                  Price
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "price",
                                      e.target.value,
                                      setSizes
                                    )
                                  }
                                  value={size.price || " "}
                                />
                              </div>
                              <div className="col-lg-2 mt-4">
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() => handleRemove(index, setSizes)}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}
                          {sizes.length === 0 && <h4>No Size Added Yet.</h4>}

                          <button
                            type="button"
                            className="btn btn-primary mt-5"
                            onClick={() => handleAddMore(setSizes)}
                          >
                            <i className="fas fa-plus" /> Add Size
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Color Tab */}
                <div
                  className="tab-pane fade"
                  id="pills-color"
                  role="tabpanel"
                  aria-labelledby="pills-color-tab"
                >
                  <div className="row gutters-sm shadow p-4 rounded">
                    <h4 className="mb-4">Color</h4>
                    <div className="col-md-12">
                      <div className="card mb-3">
                        <div className="card-body">
                          {colors.map((color, index) => (
                            <div key={color.id} className="row text-dark">
                              <div className="col-lg-4 ">
                                <label htmlFor="" className="">
                                  Name
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  value={color.name || " "}
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "name",
                                      e.target.value,
                                      setColors
                                    )
                                  }
                                />
                              </div>
                              <div className="col-lg-4 ">
                                <label htmlFor="" className="">
                                  Code
                                </label>
                                <input
                                  type="text"
                                  className="form-control"
                                  onChange={(e) =>
                                    handleInputChange(
                                      index,
                                      "color_code",
                                      e.target.value,
                                      setColors
                                    )
                                  }
                                  value={color.color_code || " "}
                                />
                              </div>
                              <div className="col-lg-2 mt-4">
                                <button
                                  type="button"
                                  className="btn btn-danger"
                                  onClick={() => handleRemove(index, setColors)}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          ))}

                          <button
                            type="button"
                            className="btn btn-primary mt-5"
                            onClick={(e) => handleAddMore(setColors)}
                          >
                            <i className="fas fa-plus" /> Add Color
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Add Product Nav Bar and Create Button */}
                <div>
                  <ul
                    className="nav nav-pills mb-3 d-flex justify-content-center mt-5"
                    id="pills-tab"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="pills-home-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-home"
                        type="button"
                        role="tab"
                        aria-controls="pills-home"
                        aria-selected="true"
                      >
                        Basic Information
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
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
                        Gallery
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
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
                        Specifications
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-size-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-size"
                        type="button"
                        role="tab"
                        aria-controls="pills-size"
                        aria-selected="false"
                      >
                        Size
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-color-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-color"
                        type="button"
                        role="tab"
                        aria-controls="pills-color"
                        aria-selected="false"
                      >
                        Color
                      </button>
                    </li>
                  </ul>
                  <div className="d-flex justify-content-center mb-5">
                    <button className="btn btn-success w-50" type="submit">
                      Create Product <i className="fa fa-check-circle" />{" "}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
