import React, { useState } from 'react';
import Layout from '../Layout';
import { showError, showSuccess, showLoading } from '../../utils/messages';
import { Link } from 'react-router-dom';
import { createCoupon } from '../../api/apiAdmin';
import { userInfo } from '../../utils/auth';

const CreateCoupon = () => {
    const [values, setValues] = useState({
        name: '',
		discount:'',
        error: false,
        success: false,
        loading: false
    });

    const { name, discount,  error, success, loading } = values;

    const handleSubmit = (e) => {
        e.preventDefault();
        setValues({
            ...values, loading: true, error: false, success: false
        });
        

        const { token } = userInfo();
        createCoupon(token, { name: name, discount:discount })
            .then(response => {
                setValues({
                    name: '',
					discount: '',
                    error: false,
                    success: true,
                    loading: false
                })
            })
            .catch(err => {
                if (err.response) setValues({
                    ...values,
                    success: false,
                    error: err.response.data,
                    loading: false
                })
                else setValues({
                    ...values,
                    success: false,
                    error: "Something went wrong!",
                    loading: false
                })
            })


    }

    const handleChange = (e) => {
        setValues({
            ...values, [e.target.name]: e.target.value, error: false
        })
    }

    const couponForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className="text-muted">Name</label>
                    <input
                        name="name"
                        type="text"
                        onChange={handleChange}
                        value={name}
                        autoFocus
                        required
                        className="form-control"
                    />
                </div>
				<div className="form-group">
                    <label className="text-muted">Discount Amount</label>
                    <input
                        name="discount"
                        type="number"
                        onChange={handleChange}
                        value={discount}
                        autoFocus
                        required
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-outline-primary">Create Category</button>
            </form>
        )
    }

    const goBack = () => (<div className="mt-5">
        <Link to="/admin/dashboard" className="text-warning">Go to Dashboard</Link>
    </div>)



  return (
	<Layout title="Add a new coupon">
	<div className="row">
		<div className="col-md-8 offset-md-2">
			{showLoading(loading)}
			{showError(error, error)}
			{showSuccess(success, 'Coupon Created!')}
			{couponForm()}
			{goBack()}
		</div>
	</div>
</Layout>
  )
}

export default CreateCoupon