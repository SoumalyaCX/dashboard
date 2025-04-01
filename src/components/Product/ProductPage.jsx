import React, { useState, useEffect, useRef } from "react";
import ProductModal from "../Modal/ProductModal";
import "./ProductPage.scss";

const ProductPage = ({ isMobile }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const searchRef = useRef(null);
  const sortRef = useRef(null);

  const productsPerPage = isMobile ? 5 : 8;

  const dummyProducts = [
    {
      id: 1,
      name: "Smartphone X",
      category: "Electronics",
      price: 79999,
      stock: 145,
      rating: 4.7,
      status: "Active",
    },
    {
      id: 2,
      name: "Wireless Headphones",
      category: "Audio",
      price: 14999,
      stock: 78,
      rating: 4.5,
      status: "Active",
    },
    {
      id: 3,
      name: "Smart Watch Pro",
      category: "Wearables",
      price: 29999,
      stock: 53,
      rating: 4.3,
      status: "Active",
    },
    {
      id: 4,
      name: "Laptop Elite",
      category: "Electronics",
      price: 129999,
      stock: 32,
      rating: 4.8,
      status: "Active",
    },
    {
      id: 5,
      name: "Bluetooth Speaker",
      category: "Audio",
      price: 8999,
      stock: 112,
      rating: 4.2,
      status: "Active",
    },
    {
      id: 6,
      name: "Desk Lamp",
      category: "Home",
      price: 3999,
      stock: 0,
      rating: 4.0,
      status: "Inactive",
    },
    {
      id: 7,
      name: "Fitness Tracker",
      category: "Wearables",
      price: 7999,
      stock: 94,
      rating: 4.1,
      status: "Active",
    },
    {
      id: 8,
      name: "Coffee Maker",
      category: "Appliances",
      price: 12999,
      stock: 0,
      rating: 4.6,
      status: "Inactive",
    },
    {
      id: 9,
      name: "Wireless Mouse",
      category: "Electronics",
      price: 4999,
      stock: 186,
      rating: 4.4,
      status: "Active",
    },
    {
      id: 10,
      name: "Gaming Console",
      category: "Electronics",
      price: 49999,
      stock: 25,
      rating: 4.9,
      status: "Active",
    },
    {
      id: 11,
      name: "Smart Thermostat",
      category: "Home",
      price: 19999,
      stock: 42,
      rating: 4.5,
      status: "Active",
    },
    {
      id: 12,
      name: "Blender Pro",
      category: "Appliances",
      price: 8999,
      stock: 0,
      rating: 4.2,
      status: "Inactive",
    },
  ];

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleAddProduct = (product) => {
    setProducts((prev) => [...prev, product]);
    setIsModalOpen(false);
  };

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
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        setTimeout(() => {
          setProducts(dummyProducts);
          setFilteredProducts(dummyProducts);
          setIsLoading(false);
        }, 800);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const searchTerm = localSearchTerm.toLowerCase();

    if (!searchTerm) {
      setFilteredProducts(products);
    } else {
      const results = products.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
      );
      setFilteredProducts(results);
    }
    setCurrentPage(1);
  }, [localSearchTerm, products]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
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

    setFilteredProducts(sortedProducts);
  };

  const handleMobileSort = (type) => {
    if (type === "price_high") {
      requestSort("price");
      setSortConfig({ key: "price", direction: "desc" });
    } else if (type === "price_low") {
      requestSort("price");
      setSortConfig({ key: "price", direction: "asc" });
    } else if (type === "rating") {
      requestSort("rating");
      setSortConfig({ key: "rating", direction: "desc" });
    } else if (type === "instock") {
      const stockSorted = [...filteredProducts].sort((a, b) =>
        a.stock > 0 && b.stock === 0 ? -1 : b.stock > 0 && a.stock === 0 ? 1 : 0
      );
      setFilteredProducts(stockSorted);
      setSortConfig({ key: "stock", direction: "desc" });
    }
    setShowSortOptions(false);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const getVisibleColumns = () => {
    if (isMobile) {
      return ["name", "category", "price", "status"];
    }
    return ["name", "category", "price", "stock", "rating", "status"];
  };

  const renderPageButtons = () => {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
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
    <div className={`product-table-container ${isMobile ? "mobile" : ""}`}>
      <div className="product-stats">
        <div className="stat-item">
          <div className="stat-icon inventory">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#5d3fd3"
            >
              <path d="M20 4H4C2.9 4 2 4.9 2 6v2c0 0.55 0.45 1 1 1h18c0.55 0 1-0.45 1-1V6C22 4.9 21.1 4 20 4z" />
              <path d="M20 11H4c-0.55 0-1 0.45-1 1v2c0 0.55 0.45 1 1 1h16c0.55 0 1-0.45 1-1v-2C21 11.45 20.55 11 20 11z" />
              <path d="M20 18H4c-0.55 0-1 0.45-1 1v2c0 0.55 0.45 1 1 1h16c0.55 0 1-0.45 1-1v-2C21 18.45 20.55 18 20 18z" />
            </svg>
          </div>
          <div className="stat-info">
            <h4>Total Products</h4>
            <h3>12</h3>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon sales">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#1ec875"
            >
              <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z" />
            </svg>
          </div>
          <div className="stat-info">
            <h4>Top Selling</h4>
            <h3>Electronics</h3>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon low-stock">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#f44336"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
          </div>
          <div className="stat-info">
            <h4>Low Stock Items</h4>
            <h3>3</h3>
          </div>
        </div>
      </div>

      <div className="product-table-header">
        <div className="table-title">
          <h3>All Products</h3>
          <div className="subtitle">Inventory Management</div>
        </div>
        <div className="table-actions">
          <button className="btn btn-primary" onClick={openModal}>
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
              "Add Product"
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
                  value={localSearchTerm}
                  onChange={(e) => setLocalSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              {isSearchExpanded && localSearchTerm && (
                <div
                  className="clear-search"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocalSearchTerm("");
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
                    onClick={() => handleMobileSort("price_high")}
                  >
                    Price (High to Low)
                  </div>
                  <div
                    className="sort-option"
                    onClick={() => handleMobileSort("price_low")}
                  >
                    Price (Low to High)
                  </div>
                  <div
                    className="sort-option"
                    onClick={() => handleMobileSort("rating")}
                  >
                    Top Rated
                  </div>
                  <div
                    className="sort-option"
                    onClick={() => handleMobileSort("instock")}
                  >
                    In Stock
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
                  if (value === "price_high") {
                    requestSort("price");
                    setSortConfig({ key: "price", direction: "desc" });
                  } else if (value === "price_low") {
                    requestSort("price");
                    setSortConfig({ key: "price", direction: "asc" });
                  } else if (value === "rating") {
                    requestSort("rating");
                    setSortConfig({ key: "rating", direction: "desc" });
                  } else if (value === "instock") {
                    const stockSorted = [...filteredProducts].sort((a, b) =>
                      a.stock > 0 && b.stock === 0
                        ? -1
                        : b.stock > 0 && a.stock === 0
                        ? 1
                        : 0
                    );
                    setFilteredProducts(stockSorted);
                    setSortConfig({ key: "stock", direction: "desc" });
                  }
                }}
              >
                <option value="price_high">Price (High to Low)</option>
                <option value="price_low">Price (Low to High)</option>
                <option value="rating">Top Rated</option>
                <option value="instock">In Stock</option>
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="product-table">
        {isLoading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading product data...</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                {getVisibleColumns().includes("name") && (
                  <th onClick={() => requestSort("name")}>
                    Product Name
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
                {getVisibleColumns().includes("category") && (
                  <th onClick={() => requestSort("category")}>
                    Category
                    {sortConfig.key === "category" && (
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
                {getVisibleColumns().includes("price") && (
                  <th onClick={() => requestSort("price")}>
                    Price
                    {sortConfig.key === "price" && (
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
                {getVisibleColumns().includes("stock") && (
                  <th onClick={() => requestSort("stock")}>
                    Stock
                    {sortConfig.key === "stock" && (
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
                {getVisibleColumns().includes("rating") && (
                  <th onClick={() => requestSort("rating")}>
                    Rating
                    {sortConfig.key === "rating" && (
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
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product.id}>
                    {getVisibleColumns().includes("name") && (
                      <td>{product.name}</td>
                    )}
                    {getVisibleColumns().includes("category") && (
                      <td>{product.category}</td>
                    )}
                    {getVisibleColumns().includes("price") && (
                      <td>₹{product.price.toFixed(2)}</td>
                    )}
                    {getVisibleColumns().includes("stock") && (
                      <td>{product.stock}</td>
                    )}
                    {getVisibleColumns().includes("rating") && (
                      <td>
                        <div className="rating">
                          {product.rating}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="#FFC107"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        </div>
                      </td>
                    )}
                    {getVisibleColumns().includes("status") && (
                      <td>
                        <div
                          className={`status-badge ${product.status.toLowerCase()}`}
                        >
                          {!isMobile && product.status}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr className="no-results-row">
                  <td colSpan={getVisibleColumns().length}>
                    No matching products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="table-footer">
        <div className="showing-entries">
          {filteredProducts.length > 0 ? (
            <>
              Showing data {indexOfFirstProduct + 1} to{" "}
              {Math.min(indexOfLastProduct, filteredProducts.length)} of{" "}
              {filteredProducts.length} entries
            </>
          ) : (
            <span className="no-results">No matching products found</span>
          )}
          {localSearchTerm && filteredProducts.length !== products.length && (
            <span className="search-results">
              {" "}
              (filtered from {products.length} total entries)
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
                / {Math.ceil(filteredProducts.length / productsPerPage)}
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
              Math.ceil(filteredProducts.length / productsPerPage)
            }
          >
            &gt;
          </button>
        </div>
      </div>

      {isModalOpen && (
        <ProductModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onAddProduct={handleAddProduct}
          isMobile={isMobile}
        />
      )}
    </div>
  );
};

export default ProductPage;
