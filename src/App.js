import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import CustomerModal from "./components/Modal/CustomerModal";
import "./styles/main.scss";
import logoIcon from "../src/assets/icons/setting 1.png";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkIsMobile();

    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  const handleAddCustomer = (customer) => {
    setCustomers((prev) => [...prev, { ...customer, id: Date.now() }]);
    setIsModalOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Router>
      <div className={`container ${isSidebarOpen ? "sidebar-open" : ""}`}>
        {isMobile && (
          <>
            <div className="mobile-header">
              {!isSidebarOpen && (
                <div className="hamburger-menu" onClick={toggleSidebar}>
                  <div className="bar"></div>
                  <div className="bar"></div>
                  <div className="bar"></div>
                </div>
              )}
              <div className="logo">
                <img src={logoIcon} alt="" />
                <h1>Dashboard</h1>
              </div>
            </div>
            <div
              className="sidebar-overlay"
              onClick={() => setIsSidebarOpen(false)}
            ></div>
          </>
        )}

        {(isSidebarOpen && isMobile) || !isMobile ? (
          <Sidebar
            isMobile={isMobile}
            onClose={() => setIsSidebarOpen(false)}
          />
        ) : null}

        <div className="content">
          <Dashboard
            customersList={customers}
            setCustomersList={setCustomers}
            onOpenModal={openModal}
            isMobile={isMobile}
          />
        </div>

        {isModalOpen && (
          <CustomerModal
            isOpen={isModalOpen}
            onClose={closeModal}
            onAddCustomer={handleAddCustomer}
            isMobile={isMobile}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
