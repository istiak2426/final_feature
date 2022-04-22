import { useEffect, useState } from "react";
import Layout from "../Layout";
import { API } from "../../utils/config";
import { Link } from "react-router-dom";
import {
  getProductDetails,
  getReviewybyId,
  createReview,
} from "../../api/apiProduct";
import { showSuccess, showError } from "../../utils/messages";
import { addToCart } from "../../api/apiOrder";
import { isAuthenticated, userInfo } from "../../utils/auth";


const ProductDetails = (props) => {
  const [product, setProduct] = useState({});
  const [review, setReview] = useState([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [values, setValues] = useState({
    name: "",
    comment: "",
  });

const { name, comment } = values;


const id = props.match.params.id;

  useEffect(() => {
    getProductDetails(id)
    .then((response) => setProduct(response.data))
      .catch((err) => setError("Failed to load products"));

  }, []);



  useEffect(() => {

    getReviewybyId(id)
      .then((response) => setReview(response.data))
      .catch((err) => setError("Failed to load products"));
      
  }, [review]);


 

  const handleSubmit = (e) => {

    

    e.preventDefault();
    setValues(values);

    createReview(id, name, comment);

    setValues({
      name: "",
      comment: "",
    });

    
  
  };





  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };


  const handleAddToCart = (product) => () => {
    if (isAuthenticated()) {
      setError(false);
      setSuccess(false);
      const user = userInfo();
      const cartItem = {
        user: user._id,
        product: product._id,
        price: product.price,
      };
      addToCart(user.token, cartItem)
        .then((reponse) => setSuccess(true))
        .catch((err) => {
          if (err.response) setError(err.response.data);
          else setError("Adding to cart failed!");
        });
    } else {
      setSuccess(false);
      setError("Please Login First!");
    }
  };

  return (
    <Layout title="Product Page">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item">
            <Link to="/">Home</Link>
          </li>
          <li class="breadcrumb-item">
            <a href="#">Product</a>
          </li>
          <li class="breadcrumb-item active" aria-current="page">
            {product.category ? product.category.name : ""}
          </li>
        </ol>
      </nav>
      <div>
        {showSuccess(success, "Item Added to Cart!")}
        {showError(error, error)}
      </div>
      <div className="row container">
        <div className="col-6">
          <img
            src={`${API}/product/photo/${product._id}`}
            alt={product.name}
            width="100%"
          />
        </div>
        <div className="col-6">
          <h3>{product.name}</h3>
          <span style={{ fontSize: 20 }}>&#2547;</span>
          {product.price}
          <p>
            {product.quantity ? (
              <span class="badge badge-pill badge-primary">In Stock</span>
            ) : (
              <span class="badge badge-pill badge-danger">Out of Stock</span>
            )}
          </p>
          <p>{product.description}</p>
          {product.quantity ? (
            <>
              &nbsp;
              <button
                className="btn btn-outline-primary btn-md"
                onClick={handleAddToCart(product)}
              >
                Add to Cart
              </button>
            </>
          ) : (
            ""
          )}

          <br />
          <br />

          <div className="container">
            <div className="row">
              <div className="col-md-6 col-lg-6 col-sm-6">
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
                    <label className="text-muted">Review</label>
                    <input
                      name="comment"
                      type="text"
                      onChange={handleChange}
                      value={comment}
                      autoFocus
                      required
                      className="form-control"
                    />
                  </div>
                  <button type="submit" className="btn btn-outline-primary">
                    Give Review
                  </button>
                </form>
              </div>
            </div>
          </div>

          <br />
          <br />

          {review.map((r) => {
            return (
              <div className="container" key={r._id}>
                <div className="row">
                  <div className="col-md-12 col-lg-12 col-sm-12">
                    <h4>{r.name}</h4>
                    <h5>{r.comment}</h5>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetails;
