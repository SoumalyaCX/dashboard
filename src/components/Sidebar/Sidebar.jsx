import React from "react";
import "./Sidebar.scss";
import logoIcon from "../../assets/icons/setting 1.png";
import dashboardIcon from "../../assets/icons/key-square.png";
import productIcon from "../../assets/icons/3d-square 1.png";
import customersIcon from "../../assets/icons/user-square 1.png";
import incomeIcon from "../../assets/icons/wallet-money 2.png";
import promoteIcon from "../../assets/icons/discount-shape 1.png";
import helpIcon from "../../assets/icons/message-question 1.png";
import proMan from "../../assets/icons/Ellipse 8.png";

const Sidebar = ({ isMobile, onClose }) => {
  return (
    <div className="sidebar">
      {isMobile && (
        <div className="back-button" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </div>
      )}

      {!isMobile && (
        <div className="logo">
          <div className="logo-icon">
            <img src={logoIcon} alt="" />
          </div>
          <h1>
            Dashboard <span className="version">v.01</span>
          </h1>
        </div>
      )}

      <nav className="nav-menu">
        <ul>
          <li className="nav-item">
            <div className="nav-link">
              <img src={dashboardIcon} alt="" />
              <span>Dashboard</span>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <img src={productIcon} alt="" />
              <span>Product</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                className="arrow-icon"
              >
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </div>
          </li>
          <li className="nav-item active">
            <div className="nav-link">
              <img src={customersIcon} alt="" />
              <span>Customers</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                className="arrow-icon"
              >
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <img src={incomeIcon} alt="" />
              <span>Income</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                className="arrow-icon"
              >
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <img src={promoteIcon} alt="" />
              <span>Promote</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                className="arrow-icon"
              >
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </div>
          </li>
          <li className="nav-item">
            <div className="nav-link">
              <img src={helpIcon} alt="" />
              <span>Help</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                className="arrow-icon"
              >
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
              </svg>
            </div>
          </li>
        </ul>
      </nav>

      <div className="upgrade-banner">
        <p>
          Upgrade to <span className="pro">PRO</span> to get access all
          Features!
        </p>
        <button className="get-pro-btn">Get Pro Now!</button>
      </div>

      <div className="user-profile">
        <div className="avatar">
          <img src={proMan} alt="User Avatar" />
        </div>
        <div className="user-info">
          <h3>John Doe</h3>
          <p>Project Manager</p>
        </div>
        <div className="dropdown-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
          >
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
