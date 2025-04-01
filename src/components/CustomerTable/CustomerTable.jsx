import React, { useState, useEffect, useRef } from "react";
import "./CustomerTable.scss";

const CustomerTable = ({
  onAddCustomer,
  searchTerm,
  customersList,
  setCustomersList,
  isMobile,
  setSearchTerm,
}) => {
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const searchRef = useRef(null);
  const sortRef = useRef(null);

  const customersPerPage = isMobile ? 5 : 8;

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchExpanded(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSortOptions(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        if (customersList.length === 0) {
          const userResponse = await fetch(
            "https://jsonplaceholder.typicode.com/users"
          );
          const userData = await userResponse.json();

          const formattedCustomers = userData.map((user) => ({
            id: user.id,
            name: user.name,
            company: user.company.name,
            phone: user.phone.split(" ")[0],
            email: user.email,
            country: [
              "United States",
              "Brazil",
              "Kiribati",
              "Israel",
              "Iran",
              "Réunion",
              "Curaçao",
              "Åland Islands",
            ][Math.floor(Math.random() * 8)],
            status: Math.random() > 0.4 ? "Active" : "Inactive",
          }));

          setCustomersList(formattedCustomers);
          setFilteredCustomers(formattedCustomers);
        } else {
          setFilteredCustomers(customersList);
        }
      } catch (error) {
        console.error("Error fetching customer data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, [customersList, setCustomersList]);

  useEffect(() => {
    const combinedSearchTerm = (searchTerm || localSearchTerm).toLowerCase();

    if (!combinedSearchTerm) {
      setFilteredCustomers(customersList);
    } else {
      const results = customersList.filter(
        (customer) =>
          customer.name.toLowerCase().includes(combinedSearchTerm) ||
          customer.email.toLowerCase().includes(combinedSearchTerm) ||
          customer.company.toLowerCase().includes(combinedSearchTerm) ||
          (customer.country &&
            customer.country.toLowerCase().includes(combinedSearchTerm)) ||
          (customer.phone &&
            customer.phone.toLowerCase().includes(combinedSearchTerm))
      );
      setFilteredCustomers(results);
    }
    setCurrentPage(1);
  }, [searchTerm, localSearchTerm, customersList]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedCustomers = [...filteredCustomers].sort((a, b) => {
      const valA = a[key] || "";
      const valB = b[key] || "";

      if (valA < valB) {
        return direction === "asc" ? -1 : 1;
      }
      if (valA > valB) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setFilteredCustomers(sortedCustomers);
  };

  const handleMobileSort = (type) => {
    if (type === "newest") {
      requestSort("id");
      setSortConfig({ key: "id", direction: "desc" });
    } else if (type === "oldest") {
      requestSort("id");
      setSortConfig({ key: "id", direction: "asc" });
    } else if (type === "active") {
      const activeSorted = [...filteredCustomers].sort((a, b) =>
        a.status === "Active" ? -1 : 1
      );
      setFilteredCustomers(activeSorted);
      setSortConfig({ key: "status", direction: "asc" });
    } else if (type === "inactive") {
      const inactiveSorted = [...filteredCustomers].sort((a, b) =>
        a.status === "Inactive" ? -1 : 1
      );
      setFilteredCustomers(inactiveSorted);
      setSortConfig({ key: "status", direction: "desc" });
    }
    setShowSortOptions(false);
  };

  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getVisibleColumns = () => {
    if (isMobile) {
      return ["name", "company", "email", "status"];
    }
    return ["name", "company", "phone", "email", "country", "status"];
  };

  const renderPageButtons = () => {
    const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);
    let pageButtons = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(
          <div
            key={i}
            className={`page-item ${currentPage === i ? "active" : ""}`}
            onClick={() => paginate(i)}
          >
            {i}
          </div>
        );
      }
    } else {
      pageButtons.push(
        <div
          key={1}
          className={`page-item ${currentPage === 1 ? "active" : ""}`}
          onClick={() => paginate(1)}
        >
          1
        </div>
      );

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (startPage > 2) {
        pageButtons.push(
          <div key="ellipsis1" className="page-ellipsis">
            ...
          </div>
        );
      }

      for (let i = startPage; i <= endPage; i++) {
        pageButtons.push(
          <div
            key={i}
            className={`page-item ${currentPage === i ? "active" : ""}`}
            onClick={() => paginate(i)}
          >
            {i}
          </div>
        );
      }

      if (endPage < totalPages - 1) {
        pageButtons.push(
          <div key="ellipsis2" className="page-ellipsis">
            ...
          </div>
        );
      }

      pageButtons.push(
        <div
          key={totalPages}
          className={`page-item ${currentPage === totalPages ? "active" : ""}`}
          onClick={() => paginate(totalPages)}
        >
          {totalPages}
        </div>
      );
    }

    return pageButtons;
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);

    if (!isSearchExpanded) {
      setTimeout(() => {
        const searchInput = searchRef.current?.querySelector("input");
        if (searchInput) {
          searchInput.focus();
        }
      }, 100);
    }
  };

  const toggleSortOptions = () => {
    setShowSortOptions(!showSortOptions);
  };

  return (
    <div className={`customer-table-container ${isMobile ? "mobile" : ""}`}>
      <div className="customer-table-header">
        <div className="table-title">
          <h3>All Customers</h3>
          <div className="subtitle">Active Members</div>
        </div>
        <div className="table-actions">
          <button className="btn btn-primary" onClick={onAddCustomer}>
            {isMobile ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="white" />
              </svg>
            ) : (
              "Add Customer"
            )}
          </button>

          {isMobile ? (
            <div
              ref={searchRef}
              className={`search-container ${
                isSearchExpanded ? "expanded" : ""
              }`}
              onClick={!isSearchExpanded ? toggleSearch : undefined}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                className={`search-icon ${isSearchExpanded ? "active" : ""}`}
              >
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              {isSearchExpanded && (
                <input
                  type="text"
                  placeholder="Search"
                  className="search-input"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              {isSearchExpanded && searchTerm && (
                <div
                  className="clear-search"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchTerm("");
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </div>
              )}
            </div>
          ) : (
            <div className="search-container">
              <input
                type="text"
                placeholder="Search"
                className="search-input"
                value={localSearchTerm}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                className="search-icon"
              >
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              {localSearchTerm && (
                <div
                  className="clear-search"
                  onClick={() => setLocalSearchTerm("")}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </div>
              )}
            </div>
          )}

          {isMobile ? (
            <div className="sort-container" ref={sortRef}>
              <div className="sort-icon" onClick={toggleSortOptions}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path d="M3 18h6v-2H3v2zm0-5h12v-2H3v2zm0-7v2h18V6H3z" />
                </svg>
              </div>
              {showSortOptions && (
                <div className="sort-options-dropdown">
                  <div
                    className="sort-option"
                    onClick={() => handleMobileSort("newest")}
                  >
                    Newest
                  </div>
                  <div
                    className="sort-option"
                    onClick={() => handleMobileSort("oldest")}
                  >
                    Oldest
                  </div>
                  <div
                    className="sort-option"
                    onClick={() => handleMobileSort("active")}
                  >
                    Active
                  </div>
                  <div
                    className="sort-option"
                    onClick={() => handleMobileSort("inactive")}
                  >
                    Inactive
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="sort-container">
              <span>Sort by: </span>
              <select
                className="sort-dropdown"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "newest") {
                    requestSort("id");
                    setSortConfig({ key: "id", direction: "desc" });
                  } else if (value === "oldest") {
                    requestSort("id");
                    setSortConfig({ key: "id", direction: "asc" });
                  } else if (value === "active") {
                    const activeSorted = [...filteredCustomers].sort((a, b) =>
                      a.status === "Active" ? -1 : 1
                    );
                    setFilteredCustomers(activeSorted);
                    setSortConfig({ key: "status", direction: "asc" });
                  } else if (value === "inactive") {
                    const inactiveSorted = [...filteredCustomers].sort((a, b) =>
                      a.status === "Inactive" ? -1 : 1
                    );
                    setFilteredCustomers(inactiveSorted);
                    setSortConfig({ key: "status", direction: "desc" });
                  }
                }}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="customer-table">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading customer data...</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                {getVisibleColumns().includes("name") && (
                  <th onClick={() => requestSort("name")}>
                    Customer Name
                    {sortConfig.key === "name" && (
                      <span
                        className={`sort-indicator ${sortConfig.direction}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                        >
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      </span>
                    )}
                  </th>
                )}
                {getVisibleColumns().includes("company") && (
                  <th onClick={() => requestSort("company")}>
                    Company
                    {sortConfig.key === "company" && (
                      <span
                        className={`sort-indicator ${sortConfig.direction}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                        >
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      </span>
                    )}
                  </th>
                )}
                {getVisibleColumns().includes("phone") && (
                  <th onClick={() => requestSort("phone")}>
                    Phone Number
                    {sortConfig.key === "phone" && (
                      <span
                        className={`sort-indicator ${sortConfig.direction}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                        >
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      </span>
                    )}
                  </th>
                )}
                {getVisibleColumns().includes("email") && (
                  <th onClick={() => requestSort("email")}>
                    Email
                    {sortConfig.key === "email" && (
                      <span
                        className={`sort-indicator ${sortConfig.direction}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                        >
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      </span>
                    )}
                  </th>
                )}
                {getVisibleColumns().includes("country") && (
                  <th onClick={() => requestSort("country")}>
                    Country
                    {sortConfig.key === "country" && (
                      <span
                        className={`sort-indicator ${sortConfig.direction}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                        >
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      </span>
                    )}
                  </th>
                )}
                {getVisibleColumns().includes("status") && (
                  <th onClick={() => requestSort("status")}>
                    Status
                    {sortConfig.key === "status" && (
                      <span
                        className={`sort-indicator ${sortConfig.direction}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                        >
                          <path d="M7 10l5 5 5-5z" />
                        </svg>
                      </span>
                    )}
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentCustomers.length > 0 ? (
                currentCustomers.map((customer) => (
                  <tr key={customer.id}>
                    {getVisibleColumns().includes("name") && (
                      <td>{customer.name}</td>
                    )}
                    {getVisibleColumns().includes("company") && (
                      <td>{customer.company}</td>
                    )}
                    {getVisibleColumns().includes("phone") && (
                      <td>{customer.phone}</td>
                    )}
                    {getVisibleColumns().includes("email") && (
                      <td>{customer.email}</td>
                    )}
                    {getVisibleColumns().includes("country") && (
                      <td>{customer.country}</td>
                    )}
                    {getVisibleColumns().includes("status") && (
                      <td>
                        <div
                          className={`status-badge ${customer.status.toLowerCase()}`}
                        >
                          {!isMobile && customer.status}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr className="no-results-row">
                  <td colSpan={getVisibleColumns().length}>
                    No matching customers found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="table-footer">
        <div className="showing-entries">
          {filteredCustomers.length > 0 ? (
            <>
              Showing data {indexOfFirstCustomer + 1} to{" "}
              {Math.min(indexOfLastCustomer, filteredCustomers.length)} of{" "}
              {filteredCustomers.length} entries
            </>
          ) : (
            <span className="no-results">No matching customers found</span>
          )}
          {(searchTerm || localSearchTerm) &&
            filteredCustomers.length !== customersList.length && (
              <span className="search-results">
                {" "}
                (filtered from {customersList.length} total entries)
              </span>
            )}
        </div>

        <div className="pagination">
          <button
            className="page-control"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>
          {isMobile ? (
            <div className="mobile-pagination">
              <span className="current-page">{currentPage}</span>
              <span className="total-pages">
                / {Math.ceil(filteredCustomers.length / customersPerPage)}
              </span>
            </div>
          ) : (
            renderPageButtons()
          )}
          <button
            className="page-control"
            onClick={() => paginate(currentPage + 1)}
            disabled={
              currentPage ===
              Math.ceil(filteredCustomers.length / customersPerPage)
            }
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerTable;
