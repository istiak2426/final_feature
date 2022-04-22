import React from "react";

const Order = (props) => {



  return (
    <div>


      <ul className="list-group" style={{border: "2px solid black"}}>
        <li className="list-group-item">User Id: {props.order.user} </li>
        <li className="list-group-item">Phone number: {props.order.address.phone}</li>

        <div className="list-group-item">cart items:{props.order.cartItems.map((o)=>{
			return(<div key={o._id}>
				<li className="list-group-item">product: {o.product} </li>
				<li className="list-group-item">price: {o.price} </li>
				<li className="list-group-item">amount: {o.count} </li>
			</div>)
			
		})}</div>

        <div className="list-group-item">address: {props.order.address.address1}</div>

        <li className="list-group-item">transaction_id: {props.order.transaction_id}</li>
        <li className="list-group-item">Payment Staus: {props.order.status}</li>
      </ul>
	 
	 <br/>
	 <br/>
    </div>
  );
};

export default Order;
