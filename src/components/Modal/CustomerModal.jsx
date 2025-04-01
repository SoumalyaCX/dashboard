import React, { useState, useEffect } from "react";
import "./CustomerModal.scss";

const CustomerModal = ({ isOpen, onClose, onAddCustomer, isMobile }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    company: "",
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

    const newCustomer = {
      ...formData,
      status: "Active",
      id: Date.now(),
    };

    onAddCustomer(newCustomer);

    setFormData({
      name: "",
      email: "",
      phone: "",
      country: "",
      company: "",
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

        <h2 className="modal-title">Add more customer</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Customer Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="company"
              placeholder="Company"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>

          <div className="modal-footer">
            <button type="submit" className="btn btn-primary">
              Add Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerModal;
