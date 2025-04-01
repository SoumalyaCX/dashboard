import React, { useState } from "react";
import Header from "../Header/Header";
import ProductPage from "./ProductPage";
import "./ProductPage.scss";

const ProductPageComponent = ({ isMobile }) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="product-page-container">
      {!isMobile && (
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      )}
      <ProductPage
        isMobile={isMobile}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
};

export default ProductPageComponent;
