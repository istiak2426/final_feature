import axios from 'axios';
import { API } from '../utils/config';

export const addToCart = (token, cartItem) => {
    return axios.post(`${API}/cart`, cartItem, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
}

export const getCartItems = (token) => {
    return axios.get(`${API}/cart`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}

export const updateCartItems = (token, cartItem) => {
    return axios.put(`${API}/cart`, cartItem, {
        headers: {
            "Content-Type": `application/json`,
            "Authorization": `Bearer ${token}`
        }
    })
}

export const deleteCartItem = (token, cartItem) => {
    return axios.delete(`${API}/cart/${cartItem._id}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}

export const getProfile = token => {
    return axios.get(`${API}/profile`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}

export const updateProfile = (token, data) => {
    return axios.post(`${API}/profile`, data, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
}


export const initPayment = token =>{
    return axios.get(`${API}/payment`,{
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}

export const createOrder = async (token, order) => {
    const res = await axios.post(`${API}/order`, order, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    return res;
}

export const getOrders = token =>{
    return axios.get(`${API}/order`, 
    {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    })
}


export const getSpecificOrders = async (token, id)=>{

    const res = await axios.get(`${API}/order/${id}`,{
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
    )
    return res;
}