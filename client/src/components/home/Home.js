import { useState, useEffect } from "react";
import Layout from "../Layout";
import Card from "./Card";
import CheckBox from "./CheckBox";
import RadioBox from "./RadioBox";
import Ascradio from "./Ascradio";
import { prices } from "../../utils/prices";
import { name } from "../../utils/name";
import { showError, showSuccess } from "../../utils/messages";
import {
  getCategories,
  getProducts,
  getFilteredProducts,
} from "../../api/apiProduct";
import { addToCart } from "../../api/apiOrder";
import { isAuthenticated, userInfo } from "../../utils/auth";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
 
  const [skip, setSkip] = useState(0);
  const [order, setOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("createdAt");
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [filters, setFilters] = useState({
    category: [],
    price: [],
  });

  const [value, setValue] = useState("");
  const [sortType, setSortype] = useState("asc");
  const [sortTypebyPrice, setSortypebyPrice] = useState("asc");
  const [limit, setLimit] = useState(8);



  const loadmore = () =>{
    setLimit(limit +limit)
  }



  useEffect(() => {
    getProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((err) => setError("Failed to load products!"));

    getCategories()
      .then((response) => setCategories(response.data))
      .catch((err) => setError("Failed to load categories!"));
  }, []);

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

  const handleFilters = (myfilters, filterBy) => {
    const newFilters = { ...filters };
    if (filterBy === "category") {
      newFilters[filterBy] = myfilters;
    }

    if (filterBy === "price") {
      const data = prices;
      let arr = [];
      for (let i in data) {
        if (data[i].id === parseInt(myfilters)) {
          arr = data[i].arr;
        }
      }
      newFilters[filterBy] = arr;
    }

    setFilters(newFilters);
    getFilteredProducts(skip, limit, newFilters, order, sortBy)
      .then((response) => setProducts(response.data))
      .catch((err) => setError("Failed to load products!"));
  };

  const showFilters = () => {
    return (
      <>
        <div className="row">
          <div className="col-sm-2">
            <h5>Filter By Categories:</h5>
            <ul>
              <CheckBox
                categories={categories}
                handleFilters={(myfilters) =>
                  handleFilters(myfilters, "category")
                }
              />
            </ul>
          </div>
          <div className="col-sm-4">
            <h5>Filter By Price:</h5>
            <div className="row">
              <RadioBox
                prices={prices}
                handleFilters={(myfilters) => handleFilters(myfilters, "price")}
              />
            </div>
          </div>
          <div className="col-sm-3">
            <h5>Sort By Name:</h5>
            <div className="row">
              <div className="col-5">
                <input
                  name="name_filter"
                  type="radio"
                  className="mr-2"
                  onChange={() => ascOrder("asc")}
                />
                <label className="form-check-lable mr-4">asc</label>
              </div>

              <div className="col-5">
                <input
                  name="name_filter"
                  type="radio"
                  className="mr-2"
                  onChange={() => ascOrder("desc")}
                />
                <label className="form-check-lable mr-4">desc</label>
              </div>
            </div>
          </div>

          <div className="col-sm-3">
            <h5>Sort By Price:</h5>
            <div className="row">
              <div className="col-5">
                <input
                  name="name_filter"
                  type="radio"
                  className="mr-2"
                  onChange={() => ascOrderbyPrice("asc")}
                />
                <label className="form-check-lable mr-4">asc</label>
              </div>

              <div className="col-5">
                <input
                  name="name_filter"
                  type="radio"
                  className="mr-2"
                  onChange={() => descOrderbyPrice("desc")}
                />
                <label className="form-check-lable mr-4">desc</label>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  const handleReset = (e) => {
    e.preventDefault();
    getProducts().then((response) => setProducts(response.data));
    setValue("");
  };

  const ascOrder = (orderByName) => {
    products.sort((a, b) => {
      const isReversed = sortType === "asc" ? -1 : 1;
      return isReversed * a.name.localeCompare(b.name);
    });
    setSortype(orderByName);
  };

  const ascOrderbyPrice = (orderByPrice) => {
    products.sort((a, b) => {
      const isReversed2 = sortTypebyPrice === "asc" ? -1 : 1;
      return isReversed2 * a.price - b.price;
    });
    setSortypebyPrice(orderByPrice);
  };

  const descOrderbyPrice = (orderByPrice) => {
    products.sort((a, b) => {
      const isReversed3 = sortTypebyPrice === "desc" ? -1 : 1;
      return isReversed3 * b.price - a.price;
    });
    setSortypebyPrice(orderByPrice);
  };

  return (
    <Layout title="Home Page" className="container-fluid">
      <form>
        <input
          type="text"
          placeholder="Search by product name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <button onClick={(e) => handleReset(e)}>Reset</button>
      </form>

      {showFilters()}
      <div style={{ width: "100%" }}>
        {showError(error, error)}
        {showSuccess(success, "Added to cart successfully!")}
      </div>
      <div className="row">
        {products.slice(0, limit)
        .filter((v) => {
            return v.name.toLowerCase().includes(value.toLowerCase());
          })
          .map((product) => (
            <Card
              product={product}
              key={product._id}
              handleAddToCart={handleAddToCart(product)}
            />
          ))}
      </div>

      <div className="col-12 text-center">
          <button className="btn btn-primary"
          onClick={()=>loadmore()}>Load more</button>
      </div>
      <br/>
    </Layout>
  );
};

export default Home;
