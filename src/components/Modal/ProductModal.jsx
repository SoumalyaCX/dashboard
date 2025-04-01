import React, { useState, useEffect } from "react";
import "./ProductModal.scss";

const ProductModal = ({ isOpen, onClose, onAddProduct, isMobile }) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    rating: "4.0",
  });

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const newProduct = {
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      rating: parseFloat(formData.rating),
      status: parseInt(formData.stock) > 0 ? "Active" : "Inactive",
      id: Date.now(),
    };

    onAddProduct(newProduct);

    setFormData({
      name: "",
      category: "",
      price: "",
      stock: "",
      rating: "4.0",
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      e.stopPropagation();
      onClose();
    }
  };

  const handleCloseButtonClick = (e) => {
    e.stopPropagation();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className={`modal-backdrop ${isMobile ? "mobile" : ""}`}
      onClick={handleBackdropClick}
    >
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button
          className="close-btn"
          onClick={handleCloseButtonClick}
          type="button"
        >
          ✕
        </button>

        <h2 className="modal-title">Add New Product</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="category-select"
            >
              <option value="" disabled>
                Select Category
              </option>
              <option value="Electronics">Electronics</option>
              <option value="Audio">Audio</option>
              <option value="Wearables">Wearables</option>
              <option value="Home">Home</option>
              <option value="Appliances">Appliances</option>
            </select>
          </div>

          <div className="form-group">
            <input
              type="number"
              name="price"
              placeholder="Price (₹)"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              name="stock"
              placeholder="Stock Quantity"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <select
              name="rating"
              id="rating"
              value={formData.rating}
              onChange={handleChange}
              required
            >
              <option value="5.0">5.0</option>
              <option value="4.9">4.9</option>
              <option value="4.8">4.8</option>
              <option value="4.7">4.7</option>
              <option value="4.6">4.6</option>
              <option value="4.5">4.5</option>
              <option value="4.4">4.4</option>
              <option value="4.3">4.3</option>
              <option value="4.2">4.2</option>
              <option value="4.1">4.1</option>
              <option value="4.0">4.0</option>
              <option value="3.5">3.5</option>
              <option value="3.0">3.0</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="submit" className="btn btn-primary">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductModal;
