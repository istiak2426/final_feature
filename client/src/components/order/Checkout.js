import React, { useState, useEffect } from 'react';
import { getCartItems, getProfile, createOrder } from '../../api/apiOrder';
import { userInfo } from '../../utils/auth';
import Layout from '../Layout';
import { Link } from 'react-router-dom';
import { isAuthenticated } from "../../utils/auth";
import CouponList from "./CouponList";
import { getCouponItem } from "../../api/apiAdmin";
import { useHistory } from "react-router";
import { Modal, ModalBody, Button } from 'reactstrap';

import { connect } from 'react-redux';

import {resetCart} from '../../redux/actionCreators'


const mapDispatchToProps = dispatch => {
  return {
      resetCart: () => dispatch(resetCart()),
  }
}


const Checkout = (props) => {

  const [orderItems, setOrderItems] = useState([]);
  const [values, setValues] = useState({
    phone: '',
    address1: '',
    address2: '',
    city: '',
    postcode: '',
    country: ''
  });

  const [couponItems, setCouponItems] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState([]);

  const {
    phone,
    address1,
    address2,
    city,
    postcode,
    country
  } = values;


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");




  useEffect(() => {
    getProfile(userInfo().token)
      .then(response => setValues(response.data))
      .catch(err => { })
    loadCart();
    loadCoupon();
  }, []);


  const history = useHistory();

  const goBack = () => {


    history.push("/")
  }


  console.log(history)




  const submitHandler = () => {

    const order = {
      cartItems: orderItems,
      address: values,
      user: userInfo()._id,
      price: getOrderTotal(),
      orderTime: new Date(),
    }
    createOrder(userInfo().token, order)
      .then(response => {
        if (response.status === 201) {
          setIsModalOpen(true)
          setModalMsg("Order Placed Successfully!")
          props.resetCart();
        }

        

        else {
          setIsModalOpen(true)
          setModalMsg("Something Went Wrong! Order Again!")
        }


      }



      )
      .catch(err => {
        setIsModalOpen(true)
        setModalMsg("Something Went Wrong! Order Again!")

      })


  }




  const loadCoupon = () => {
    getCouponItem()
      .then((response) => setCouponItems(response.data))
      .catch(() => { });
  };

  const loadCart = () => {
    getCartItems(userInfo().token)
      .then(response => setOrderItems(response.data))
      .catch((err => console.log(err)));
  }

  const getOrderTotal = () => {
    const arr = orderItems.map(cartItem => cartItem.price * cartItem.count);
    const sum = arr.reduce((a, b) => a + b, 0);

    let disc = null;
    let discountSum = sum;

    if (!selectedCoupon.discount) {
      discountSum = sum;
    } else {
      discountSum = sum - selectedCoupon.discount;
    }

    return discountSum;

  }

  const onSelectCoupon = (coupon) => {
    setSelectedCoupon(coupon);

    if (isAuthenticated()) {
      const user = userInfo();

      const cartItem = {
        user: user._id,
        coupon: coupon.discount,
      };


    }
  };

  const coupon = couponItems.map((c) => {
    return <CouponList coupon={c} key={c._id} SelectCoupon={onSelectCoupon} />;
  });

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

      <tr>
        <th scope="row">Promo</th>
        <th>{selectedCoupon.name}</th>
        <td> </td>
        <td></td>
        <td align="right">৳ {selectedCoupon.discount}</td>
      </tr>

    );
  }

  const shippinDetails = () => (
    <>
      To,
      <br /> <b>{userInfo().name}</b>
      <br /> Phone: {phone}
      <br /> {address1}
      {address2 ? (<><br />{address2}</>) : ""}
      <br /> {city}-{postcode}, {country}
    </>
  )

  if (address1 && city && phone && postcode && country) return (<>
    <Layout title="Checkout" description="Complete your order!" className="container">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link href="#">Order</Link></li>
          <li className="breadcrumb-item"><Link href="#">Cart</Link></li>
          <li className="breadcrumb-item"><Link href="#">Shipping Address</Link></li>
          <li className="breadcrumb-item active" aria-current="page">Checkout</li>
        </ol>
      </nav>
      <div className="container">
        <div className="row">
          <div className="col-md-8">
            <div className="card mb-5" style={{ height: 'auto' }}>
              <div className="card-header">Shipping Details</div>
              <div className="card-body">
                {shippinDetails()}
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card" style={{ height: 'auto' }}>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  {orderItems.map(item => (<li key={item._id} className="list-group-item" align="right">{item.product ? item.product.name : ""} x {item.count} = ৳ {item.price * item.count} </li>))}
                </ul>
              </div>
              <div className="card-footer">
                <span className="float-left"><b>Order Total</b></span>
                <span className="float-right"><b>৳ {getOrderTotal()}</b></span>
              </div>
            </div>
            <br />
            <p><button
              className='btn'
              onClick={submitHandler}
            >
              Cash on Delivery </button></p>

            <p><button
              className='btn'
            //  onClick={submitHandler}
            >
              Online Payment </button></p>
          </div>
        </div>

        {onSelect}

        {coupon}
      </div>
      <Modal isOpen={isModalOpen} >
        <ModalBody>
          <p>{modalMsg}</p>
          <Button onClick={goBack} >Close</Button>
        </ModalBody>
      </Modal>
    </Layout>
  </>);
  else return <></>
}

export default connect(null, mapDispatchToProps)(Checkout);