import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import apiInstance from '../../utils/axios';
import UserData from '../plugin/UserData';
import moment from 'moment';
import Swal from 'sweetalert2'
import { CartContext } from '../plugin/Context';
import CartID from '../plugin/CardID';
import GetCurrentAddress from '../plugin/UserCountry';


const Toast =Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 3500,
    timerProgressBar: true
})

function Shop() {
    const [vendor, setVendor] = useState([])
    const [products, setProducts] = useState([])

    const [colorValue, setColorValue] = useState("No Color")
    const [sizeValue, setSizeValue] = useState("No Size")
    const [qtyValue, setQtyValue] = useState(1)

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedColors, setSelectedColors] = useState({});

    const [selectedSize, setSelectedSize] = useState({});

    const [cartCount, setCartCount] = useContext(CartContext)

    const currentAddress = GetCurrentAddress()
    const userData = UserData()
    const cart_id = CartID()

    const param = useParams()

    useEffect(() => {
        apiInstance.get(`shop/${param.slug}/`).then((res) => {
            setVendor(res.data)
        })

    }, [])

    useEffect(() => {
        apiInstance.get(`vendor-products/${param.slug}/`).then((res) => {
            setProducts(res.data)
        })
    }, [])

    const handleColorButtonClick = (event, product_id, colorName) => {
        setColorValue(colorName);
        setSelectedProduct(product_id);

        setSelectedColors((prevSelectedColors) => ({
            ...prevSelectedColors,
            [product_id]: colorName,
        }));

    };

    const handleSizeButtonClick = (event, product_id, sizeName) => {
        setSizeValue(sizeName);
        setSelectedProduct(product_id);
        

        setSelectedSize((prevSelectedSize) => ({
            ...prevSelectedSize,
            [product_id]: sizeName,
        }));

    }

    const handleQtyChange = (event, product_id) => {
        setQtyValue(event.target.value);
        setSelectedProduct(product_id);
    };

    const handleAddToCart = async (product_id, price, shipping_amount) => {
       
        const formdata = new FormData()

            formdata.append('product_id', product_id)
            formdata.append('user_id', userData?.user_id)
            formdata.append('qty', qtyValue)
            formdata.append('price' , price)
            formdata.append('shipping_amount', shipping_amount)
            formdata.append('country', currentAddress.country)
            formdata.append('size', sizeValue)
            formdata.append('color', colorValue)
            formdata.append('cart_id', cart_id)

            const response = await apiInstance.post('cart-view/', formdata)
            console.log(response.data)

            Toast.fire({
                icon: "success",
                title: response.data.message
            })

            const url = userData ? `cart-list/${cart_id}/${userData?.user_id}/` : `cart-list/${cart_id}/`
            apiInstance.get(url).then((res) => {
                setCartCount(res.data.length)
            })
        };

        const addToWishlist = async (productId, userId) => {
            try {
                const formdata = new FormData()
            formdata.append("product_id", productId)
            formdata.append("user_id", userId)
            
            const response = await apiInstance.post(`customer/wishlist/${userId}/`, formdata)
            console.log(response.data);
    
            Swal.fire({
                icon: "success",
                title: response.data.message,
            })
            } catch (error) {
                console.log(error)
            }
        }



  return (
    <main className="mt-5">
    <div className="container">
        <section className="text-center container">
            <div className="row py-lg-5">
                <div className="col-lg-6 col-md-8 mx-auto">
                    <img src={vendor.image} style={{ width: 100, height: 100, objectFit: "cover", borderRadius: "50%" }} alt="" />
                    <h1 className="fw-light">{vendor.name}</h1>
                    <p className="lead text-muted">{vendor.description}</p>
                </div>
            </div>
        </section>
        <section className="text-center">
            <h4 className="mb-4">{products.length} Product(s) </h4>
            <div className="row">
                {products?.map((p, index) => (
                    <div className="col-lg-4 col-md-12 mb-4" key={index}>
                        <div className="card">
                        <div
                            className="bg-image hover-zoom ripple"
                            data-mdb-ripple-color="light"
                        >
                            <Link to={`/detail/${p.slug}/`}>
                                <img
                                src={p.image}
                                className="w-100"
                                style={{width:"100%", height:"400px", objectFit:"cover"}}
                                />
                            </Link>
                        </div>
                        <div className="card-body">
                            <a href="" className="text-reset">
                            <h5 className="card-title mb-3">{p.title}</h5>
                            </a>
                            <a href="" className="text-reset">
                            <p>{p.category?.title}</p>
                            </a>
                            <div className='d-flex justify-content-center'>
                            <h6 className="mb-3">${p.price}</h6>
                            <h6 className="mb-3 text-muted ms-2"><strike>${p.old_price}</strike></h6>
                            </div>
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
                                {/* Quantity */}
                                <div className="d-flex flex-column mb-2 mt-2 p-1">
                                <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                    <>
                                        <li>
                                            <input
                                                type="number"
                                                className='form-control'
                                                placeholder='Quantity'
                                                onChange={(e) => handleQtyChange(e, p.id)}
                                            />
                                        </li>
                                    </>
                                </div>
                            </div>
                                {p.size?.length > 0 &&
                                    <div className="d-flex flex-column">
                                        <li className="p-1">
                                            <b>Size</b>: {selectedSize[p.id] || 'Select a size'}
                                        </li>
                                    <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                {p.size?.map((size, index) => (
                                    <li key={index}>
                                        <button on onClick={(e) => handleSizeButtonClick(e, p.id, size.name)} className="btn btn-secondary btn-sm me-2 mb-1">
                                            {size.name}
                                        </button>
                                    </li>
                                    ))}
                                </div>
                                </div>
                                }
                                {p.color?.length > 0 &&
                                <div className="d-flex flex-column mt-3">
                                <li className="p-1">
                                    <b>Color</b>: {selectedColors[p.id] || 'Select a color'}
                                </li>
                                <div className="p-1 mt-0 pt-0 d-flex flex-wrap">
                                {p.color?.map((color, index) => (
                                    <li key={index}>
                                    <button
                                        className="btn btn-sm me-2 mb-1 p-3"
                                        style={{ backgroundColor: `${color.color_code}`}}
                                        onClick={(e) => handleColorButtonClick(e, p.id, color.name)}
                                    />
                                    </li>
                                    ))}
                                </div>
                                </div>
                                }
                                <div className="d-flex mt-3 p-1">
                                <button
                                    type="button"
                                    className="btn btn-primary me-1 mb-1"
                                    onClick={() => handleAddToCart(p.id, p.price, p.shipping_amount)}
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
                            </ul>
                            <button
                                type="button"
                                className="btn btn-danger px-3 me-1 ms-2"
                                onClick={() => addToWishlist(p.id, userData?.user_id)}
                            >
                                <i className="fas fa-heart" />
                            </button>
                            </div>
                        </div>
                        </div>
                    </div>
                    ))}
                {/* .map() function end here */}
            </div>
        </section>
    </div>
</main>
  )
}

export default Shop