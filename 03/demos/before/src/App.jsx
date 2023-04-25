import React, { useState, useEffect } from "react";
import "./App.css";
import Footer from "./Footer";
import Header from "./Header";
import { getProducts } from "./services/productService";
import Spinner from "./Spinner";

export default function App() {
  /* 
    Defining state variables using the useState hook.
  */
  const [size, setSize] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  /*
    Using the useEffect hook to fetch data from the server when the component mounts. 
  */
  useEffect(() => {
    async function init() {
      try {
        const response = await getProducts("shoes");
        setProducts(response);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  /*
    Defining a helper that returns a div element with product details
  */
  function renderProduct(p) {
    return (
      <div key={p.id} className="product">
        <a href="/">
          <img src={`/images/${p.image}`} alt={p.name} />
          <h3>{p.name}</h3>
          <p>${p.price}</p>
        </a>
      </div>
    );
  }

  /*
    Using the conditional operator to filter the products array based on the selected size. 
    If no size is selected, all products will be displayed
  */
  const filtredProducts = size
    ? products.filter((p) => p.skus.find((s) => s.size === parseInt(size)))
    : products;

  /*
    Display error
  */
  if (error) throw error;

  /*
    Display Spinner for loading
  */
  if (loading) return <Spinner />;

  return (
    <>
      <div className="content">
        <Header />
        <main>
          <section id="filters">
            <label htmlFor="size">Filter by Size:</label>{" "}
            <select
              id="size"
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <option value="">All sizes</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
            </select>
            {size && <h2>found {filtredProducts.length} items</h2>}
          </section>
          <section id="products">{filtredProducts.map(renderProduct)}</section>
        </main>
      </div>
      <Footer />
    </>
  );
}
