import { API } from '../utils/config';
import axios from 'axios';

export const getProducts = () => {
    return axios.get(`${API}/product/`)
}

export const getProductDetails = (id) => {
    return axios.get(`${API}/product/${id}`)
}

export const getReviewybyId = (id) => {
    return axios.get(`${API}/review/${id}`)
}

export const createReview = (id, name, comment) => {
    return axios.post(`${API}/review/`, {
        productId : id,
        name: name,
        comment :comment
    })
}








export const getCategories = () => {
    return axios.get(`${API}/category`)
}



export const getFilteredProducts = (skip, limit, filters = {}, order, sortBy) => {
    const data = {
        order: order,
        sortBy: sortBy,
        limit: limit,
        skip: skip,
        filters: { ...filters }
    }
    return axios.post(`${API}/product/filter`, data, {
        headers: {
            "Content-Type": "application/json"
        }
    })
}