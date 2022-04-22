import React from 'react'
import { useState } from 'react';

const CouponList = (props) => {

const [disabled, setDisabled] = useState(false);



const handleButton = (e)=> {
  console.log("clicked")
  setDisabled(false);
}

  return (
	<div><div 
            style={{cursor:"pointer", width:"100%", height:"2rem", background:"orange"}}>
                <span>
              {props.coupon.name}

				</span> 
                <span>
				{props.coupon.discount}
					</span>
                </div>

                <button 
    
                onClick={() => { props.SelectCoupon(props.coupon); handleButton();}}

     



                >add</button></div>
  )
}

export default CouponList