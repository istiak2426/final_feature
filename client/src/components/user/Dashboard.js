import Layout from '../Layout';
import { Link } from 'react-router-dom';
import { userInfo } from '../../utils/auth';

import {getOrders} from "../../api/apiOrder";
import { useEffect, useState } from 'react';

import Order from './Order';




const Dashboard = () => {

    const [orders, setOrders]= useState([])



    useEffect(()=>{
        getOrders()
        .then(res => setOrders(res.data));
    }, [])


 

   const orderDetails =  orders.map((order)=>{
        return(<Order order={order} key={order._id}/>)})


    
    const { name, email, role } = userInfo();
    const UserLinks = () => {
        return (
            <div className="card">
                <h4 className="card-header">User Links</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link className="nav-link" to="#">My Cart</Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to="#">Update Profile</Link>
                    </li>
                </ul>
            </div>
        )
    };

    const PurchaseHistory = () => (

        
        <div className="card mb-5">
            <h3 className="card-header">Purchase History</h3>
            {orderDetails}
            
            
        </div>
    );

    const UserInfo = () => (
        <div className="card mb-5">
            <h3 className="card-header">User Information</h3>
            <ul className="list-group">
                <li className="list-group-item">{name}</li>
                <li className="list-group-item">{email}</li>
                <li className="list-group-item">{role}</li>
            </ul>
        </div>
    );

    return (
        <Layout title="Dashboard" className="container-fluid">
            <div className="row">
                <div className="col-sm-3">
                    <UserLinks />
                </div>
                <div className="col-sm-9">
                    <UserInfo />
                    <PurchaseHistory />
                    {/* <div>{orders[0].address.city}</div> */}
                </div>
            </div>
        </Layout>
    )
}

export default Dashboard;