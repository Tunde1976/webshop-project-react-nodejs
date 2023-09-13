import { read } from "../../repositories/Crud";
import React, { useState, useEffect } from 'react';
import SingleProduct from "./SingleProduct";
import '../../assets/style/productlist.css';

export default function ProductList() {

  const [productsData, setProductsData] = useState([]);
  console.log("productsdata:", productsData)
  const [colors, setColors] = useState(["#fe4578", "#fe4578", "#650f28", "#F1C93B", "#1A5D1A", "#e67132", "#47dad3", "#cdd743"]);
  const max = productsData ? productsData.length - 1 : 6;
  const [currentPage, setCurrentPage] = useState(1);
  const [selectValue, setSelectValue] = useState("order");
  const itemsPerPage = 8;

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage, selectValue]);

  const fetchProducts = async (page) => {
    try {

      //TODO újra kell futtatni a queryt az új paramok szerint, mert a setSelectValue nem elég
      const orderBy = (selectValue && selectValue !== "order") ? selectValue.split("-")[0] : null;
      const order = (selectValue && selectValue !== "order") ? selectValue.split("-")[1] : null;
      console.log(orderBy, order, "rendezés");
      const res = await read(`api/products?page=${page}&orderBy=${orderBy}&order=${order}`);
      const obj = await res.json();
      console.log('Obj', obj);
      setProductsData(obj.products);
    } catch (error) {
      console.error('Hiba történt a termékek lekérdezésekor.', error);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  return (
    <>
           <div className="top-bar">
        <div className="select-option">
          <select value={selectValue} id="ordered-list" onChange={(e) => setSelectValue(e.target.value)} >
            <option value="order">Rendezés</option>
            <option value="title-asc">Név szerint növekvő</option>
            <option value="title-desc">Név szerint csökkenő</option>
            <option value="price-asc">Ár szerint növekvő</option>
            <option value="price-desc">Ár szerint csökkenő</option>
          </select>
        </div>
      </div>

      <div className="productlist-container">

        {
          productsData && productsData.map((product, idx) => (
            // ha a kategória != upsell
            //if (`${product.description}` = "upsell") 
              

            
            
            <SingleProduct product={product} bgcolor={colors[Math.floor(Math.random() * max)]} />
          ))
        }

      </div>
      <div className="pagination-buttons">
        <button onClick={handlePrevPage} className={currentPage === 1 ? "disabled" : ""} disabled={currentPage === 1}>Vissza</button>
        <br></br>
        <button onClick={handleNextPage} className={productsData && productsData.length < itemsPerPage ? "disabled" : ""} disabled={productsData && productsData.length < itemsPerPage}>Előre</button>
      </div>
    </>
  )
}