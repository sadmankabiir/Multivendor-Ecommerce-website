import { useEffect, useState } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

import Login from './views/auth/Login'; // Import the 'Login' component.
import Register from './views/auth/Register'; // Import the 'Register' component.
import Logout from './views/auth/Logout'; // Import the 'Logout' component.
import ForgotPassword from './views/auth/ForgotPassword'; // Import the 'ForgotPassword' component.
import CreatePassword from './views/auth/CreatePassword';
import StoreHeader from "./views/base/StoreHeader";
import StoreFooter from "./views/base/StoreFooter";
import Products from "./views/store/Products";
import ProductDetail from "./views/store/ProductDetail";
import Cart from "./views/store/Cart";
import Checkout from "./views/store/Checkout";
import PaymentSuccess from "./views/store/PaymentSuccess";
import { CartContext } from './views/plugin/Context';
import CartID from './views/plugin/CardID';
import UserData from './views/plugin/UserData';
import apiInstance from './utils/axios';
import Search from './views/store/Search';
import Account from './views/customer/Account';
import PrivateRoute from './layout/PrivateRoute';
import MainWrapper from './layout/MainWrapper';
import Orders from './views/customer/Orders';
import OrderDetail from './views/customer/OrderDetail';
import Wishlist from './views/customer/Wishlist';
import CustomerNotification from './views/customer/CustomerNotification';
import CustomerSettings from './views/customer/Settings';
import Invoice from './views/customer/Invoice';
import Dashboard from './views/vendor/Dashboard';
import Product from './views/vendor/Product';
import VendorOrders from './views/vendor/Orders';
import VendorOrderDetail from './views/vendor/OrderDetail';
import Earning from './views/vendor/Earning';
import Reviews from './views/vendor/Reviews';
import ReviewDetail from './views/vendor/ReviewDetail';
import Coupon from './views/vendor/Coupon';
import EditCoupon from './views/vendor/EditCoupon';
import Notification from './views/vendor/Notification';
import VendorSettings from './views/vendor/VendorSettings';
import Shop from './views/vendor/Shop';
import AddProduct from './views/vendor/AddProduct';
import UpdateProduct from './views/vendor/UpdateProduct';

function App() {
  const [count, setCount] = useState(0)
  const [cartCount, setCartCount] = useState()

  const cart_id = CartID()
  const userData = UserData()

  useEffect(() => {
    const url = userData ? `cart-list/${cart_id}/${userData?.user_id}/` : `cart-list/${cart_id}/`;
    apiInstance.get(url).then((res) => {
      setCartCount(res.data.length)
    })
  }, [])


  return (
    <CartContext.Provider value={[cartCount, setCartCount]}>
    <BrowserRouter>
    <StoreHeader/>
    <MainWrapper>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/logout' element={<Logout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/create-new-password" element={<CreatePassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        

        {/* STORE COMPONENTS */}
        <Route path='/' element={<Products />} />
        <Route path='/detail/:slug/' element={<ProductDetail />} />
        <Route path='/cart/' element={<Cart />} />
        <Route path='/checkout/:order_oid/' element={<Checkout />} />
        <Route path='/payment-success/:order_oid/' element={<PaymentSuccess />} />
        <Route path="/search" element={<Search />} />

        {/* Customer Routs */}
        <Route path="/customer/account/" element={<PrivateRoute><Account /></PrivateRoute>} />
        <Route path="/customer/orders/" element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="/customer/orders/:order_oid/" element={<PrivateRoute><OrderDetail /></PrivateRoute>} />
        <Route path="/customer/wishlist/" element={<PrivateRoute><Wishlist /></PrivateRoute>} />
        <Route path="/customer/notifications/" element={<PrivateRoute><CustomerNotification /></PrivateRoute>} />
        <Route path="/customer/settings/" element={<PrivateRoute><CustomerSettings /></PrivateRoute>} />
        <Route path="/customer/invoice/:order_oid/" element={<PrivateRoute><Invoice /></PrivateRoute>} />

        {/* Vendor Routs */}
        <Route path="/vendor/dashboard/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/vendor/products/" element={<PrivateRoute><Product /></PrivateRoute>} />
        <Route path="/vendor/orders/" element={<PrivateRoute><VendorOrders /></PrivateRoute>} />
        <Route path="/vendor/orders/:order_oid/" element={<PrivateRoute><VendorOrderDetail /></PrivateRoute>} />
        <Route path="/vendor/earning/" element={<PrivateRoute><Earning /></PrivateRoute>} />
        <Route path="/vendor/reviews/" element={<PrivateRoute><Reviews /></PrivateRoute>} />
        <Route path="/vendor/reviews/:review_id/" element={<PrivateRoute><ReviewDetail /></PrivateRoute>} />
        <Route path="/vendor/coupon/" element={<PrivateRoute><Coupon /></PrivateRoute>} />
        <Route path="/vendor/coupon/:coupon_id/" element={<PrivateRoute><EditCoupon /></PrivateRoute>} />
        <Route path="/vendor/notifications/" element={<PrivateRoute><Notification /></PrivateRoute>} />
        <Route path="/vendor/settings/" element={<PrivateRoute><VendorSettings /></PrivateRoute>} />
        <Route path="/vendor/:slug/" element={<PrivateRoute><Shop /></PrivateRoute>} />
        <Route path="/vendor/add-product/" element={<PrivateRoute><AddProduct /></PrivateRoute>} />
        <Route path="/vendor/product/update/:pid/" element={<PrivateRoute><UpdateProduct /></PrivateRoute>} />
        

      </Routes>
      </MainWrapper>
      <StoreFooter/>
    </BrowserRouter>
    </CartContext.Provider>
  )
}

export default App
