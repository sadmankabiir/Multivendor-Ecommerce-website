import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";
import apiInstance from "../../utils/axios";
import UserData from "../plugin/UserData";
import { CartContext } from "../plugin/Context";

function StoreHeader() {
  const [isLoggedIn, user] = useAuthStore((state) => [
    state.isLoggedIn,
    state.user,
  ]);

  const cartCount = useContext(CartContext);
  const [profile, setProfile] = useState({});

  const userData = UserData();

  useEffect(() => {
    apiInstance.get(`user/profile/${userData?.user_id}/`).then((res) => {
      setProfile(res.data);
    });
  }, []);

  const [search, setSearch] = useState("");

  const texts = [
    "Search for a Product",
    "Search for a Category",
    "Search for a Description",
  ];
  const [placeholder, setPlaceholder] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  // Script for typing effect
  useEffect(() => {
    if (charIndex < texts[textIndex].length) {
      const typeInterval = setInterval(() => {
        setPlaceholder((prev) => prev + texts[textIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 150);
      return () => clearInterval(typeInterval);
    } else {
      const completeInterval = setTimeout(() => {
        setShowCursor(false);
        setTimeout(() => {
          setShowCursor(true);
          setPlaceholder("");
          setTextIndex((prev) => (prev + 1) % texts.length);
          setCharIndex(0);
        }, 500);
      }, 2000);
      return () => clearTimeout(completeInterval);
    }
  }, [charIndex, textIndex, texts]);

  const navigate = useNavigate();

  // Helper functions for search
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };
  const handleSearchSubmit = (event) => {
    event.preventDefault();
    navigate(`/search?query=${search}`);
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">
            Nova
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Pages
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <a className="dropdown-item" href="#">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Blog{" "}
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Changelog
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Terms & Condition
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      Cookie Policy
                    </a>
                  </li>
                </ul>
              </li>

              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Vendor
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <Link className="dropdown-item" to="/vendor/dashboard/">
                      {" "}
                      <i className="fas fa-user"></i> Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/products/">
                      {" "}
                      <i className="bi bi-grid-fill"></i> Products
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/add-product/">
                      {" "}
                      <i className="fas fa-plus-circle"></i> Add Products
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/orders/">
                      {" "}
                      <i className="fas fa-shopping-cart"></i> Orders
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/earning/">
                      {" "}
                      <i className="fas fa-dollar-sign"></i> Earning
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/reviews/">
                      {" "}
                      <i className="fas fa-star"></i> Reviews
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/coupon/">
                      {" "}
                      <i className="fas fa-tag"></i> Coupon
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/notifications/">
                      {" "}
                      <i className="fas fa-bell fa-shake"></i> Notifications
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/vendor/settings/">
                      {" "}
                      <i className="fas fa-gear fa-spin"></i> Settings
                    </Link>
                  </li>
                </ul>
              </li>
            </ul>
            <div className="">
              <form
                className="d-flex px-lg-4 w-100"
                style={{ height: 39 }}
                onSubmit={handleSearchSubmit}
              >
                <input
                  onChange={handleSearchChange}
                  name="search"
                  className="form-control me-2"
                  type="text"
                  placeholder={`${placeholder}${showCursor ? "_" : ""}`}
                  aria-label="Search"
                />
                <button className="btn btn-light me-2" type="submit">
                  <i className="fas fa-search"></i>
                </button>
              </form>
            </div>

            {isLoggedIn() ? (
              <div className="dropdown text-end mx-2">
                <a
                  href="#"
                  className="d-block link-body-emphasis text-decoration-none dropdown-toggle"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <img
                    src={profile.image}
                    alt="mdo"
                    width="32"
                    height="32"
                    className="rounded-circle"
                  />
                </a>
                <ul className="dropdown-menu text-small">
                  <li>
                    <Link to={"/customer/account/"} className="dropdown-item">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to={`/customer/orders/`}>
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to={`/customer/wishlist/`}>
                      Wishlist
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="dropdown-item"
                      to={`/customer/notifications/`}
                    >
                      Notifications
                    </Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to={`/customer/settings/`}>
                      Settings
                    </Link>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/logout">
                      Log out
                    </Link>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <Link className="btn btn-primary me-2" to="/login">
                  Login
                </Link>
                <Link className="btn btn-primary me-2" to="/register">
                  Register
                </Link>
              </>
            )}

            <div className="mx-2">
              <Link className="btn btn-danger" to="/cart/">
                <i className="fas fa-shopping-cart"></i>{" "}
                <span id="cart-total-items">{cartCount}</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default StoreHeader;
