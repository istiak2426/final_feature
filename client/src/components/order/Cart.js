import { useState, useEffect } from "react";
import Layout from "../Layout";
import CartItem from "./CartItem";
import { Link } from "react-router-dom";
import {
  getCartItems,
  updateCartItems,
  deleteCartItem,
} from "../../api/apiOrder";

import CouponList from "./CouponList";

import { getCouponItem } from "../../api/apiAdmin";

import { userInfo } from "../../utils/auth";

import { isAuthenticated } from "../../utils/auth";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [couponItems, setCouponItems] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState([]);

  const [totalSum, setTotalSum] = useState(0);

  const loadCart = () => {
    getCartItems(userInfo().token)
      .then((response) => setCartItems(response.data))
      .catch(() => {});
  };

  const loadCoupon = () => {
    getCouponItem()
      .then((response) => setCouponItems(response.data))
      .catch(() => {});
  };
  useEffect(() => {
    loadCart();
    loadCoupon();
  }, []);



    const onSelectCoupon = (coupon) => {
      setSelectedCoupon(coupon);
      setTotalSum((prevState) => {
  
        return  getCartTotal()
      });
  
      if (isAuthenticated()) {
        const user = userInfo();
  
  
      }
    };

  const increaseItem = (item) => () => {
    if (item.count === 5) return;
    const cartItem = {
      ...item,
      count: item.count + 1,
    };
    updateCartItems(userInfo().token, cartItem)
      .then((response) => loadCart())
      .catch((err) => {});
  };

  const getCartTotal = () => {
    const arr = cartItems.map((item) => item.price * item.count);
    let sum = arr.reduce((a, b) => a + b, 0);

    let discountSum = null;

    if (selectedCoupon.discount) {
      discountSum = sum - selectedCoupon.discount;
      
    }    
  return discountSum;
  };

 
  console.log(totalSum)

  let onSelect = null;

  if (selectedCoupon.length === 0) {
    onSelect = (
      <tr>
        <th scope="row">No Promo</th>
        <th></th>
        <td> </td>
        <td></td>
        <td align="right"></td>
      </tr>
    );
  } else if (selectedCoupon.length === undefined) {
    onSelect = (
      <>
        <tr>
          <th scope="row">Promo</th>
          <th>{selectedCoupon.name}</th>
          <td> </td>
          <td></td>
          <td align="right">৳ {selectedCoupon.discount}</td>
        </tr>
      </>
    );
  }

  const coupon = couponItems.map((c) => {
    return <CouponList coupon={c} key={c._id} SelectCoupon={onSelectCoupon} />;
  });

  const decreaseItem = (item) => () => {
    if (item.count === 1) return;
    const cartItem = {
      ...item,
      count: item.count - 1,
    };

    console.log(cartItem);
    updateCartItems(userInfo().token, cartItem)
      .then((response) => loadCart())
      .catch((err) => {});
  };

  const removeItem = (item) => () => {
    if (!window.confirm("Delete Item?")) return;
    deleteCartItem(userInfo().token, item)
      .then((response) => {
        loadCart();
      })
      .catch(() => {});
  };

  return (
    <Layout
      title="Your Cart"
      description="Hurry up! Place your order!"
      className="container"
    >
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <a href="#">Order</a>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Cart
          </li>
        </ol>
      </nav>
      <div className="container my-5">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col" width="15%">
                #
              </th>
              <th scope="col">Image</th>
              <th scope="col">Product Name</th>
              <th scope="col">Quantity</th>
              <th scope="col" align="right">
                Price
              </th>
              <th scop="col">Remove</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, i) => (
              <CartItem
                item={item}
                serial={i + 1}
                key={item._id}
                increaseItem={increaseItem(item)}
                decreaseItem={decreaseItem(item)}
                removeItem={removeItem(item)}
              />
            ))}

            {onSelect}

            <tr>
              <th scope="row" />
              <td colSpan={3}>Total</td>
              <td align="right">৳ {getCartTotal()} </td>
              <td />
            </tr>
            <tr>
              <th scope="row" />
              <td colSpan={5} className="text-right">
                <Link to="/">
                  <button className="btn btn-warning mr-4">
                    Continue Shoping
                  </button>
                </Link>
                <Link to="/shipping" className="btn btn-success mr-4">
                  Proceed To Checkout
                </Link>
              </td>
            </tr>
          </tbody>
        </table>

        <div>Add Coupon</div>
        {coupon}
      </div>
    </Layout>
  );
};

export default Cart;
