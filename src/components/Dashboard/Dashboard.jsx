import React, { useState, useCallback } from "react";
import Header from "../Header/Header";
import StatCards from "./StatCards";
import CustomerTable from "../CustomerTable/CustomerTable";
import "./Dashboard.scss";

const Dashboard = ({
  customersList,
  setCustomersList,
  onOpenModal,
  isMobile,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="dashboard-container">
      {!isMobile && (
        <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      )}
      <StatCards isMobile={isMobile} />
      <CustomerTable
        onAddCustomer={onOpenModal}
        searchTerm={searchTerm}
        customersList={customersList}
        setCustomersList={setCustomersList}
        isMobile={isMobile}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
};

export default Dashboard;
