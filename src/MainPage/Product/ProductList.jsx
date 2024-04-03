import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Table } from "antd";
import "react-select2-wrapper/css/select2.css";
import "./productList.css";
import { adminApiInstance } from "../../api/axios";
import { DeleteIcon, EyeIcon, Printer } from "../../EntryFile/imagePath";
import GenerateBarcodePopUp from "./GenerateBarcodePopUp";
import Swal from "sweetalert2";
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import { MdOutlineClear } from "react-icons/md";

const ProductList = () => {
  const [loads, setLoads] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedLoad, setSelectedLoad] = useState(null);
  const [filterBy, setFilterBy] = useState(null); 
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const [categoryOptions, setCategoryOptions] = useState([]); 
  const [filteredLoads, setFilteredLoads] = useState([]); // State for filtered loads
  const [searchLoadNumber, setSearchLoadNumber] = useState(""); // State for load number search
  const [searchLoadBrand, setSearchLoadBrand] = useState(""); // State for brand name search
  const [searchLoadSKU, setSearchLoadSKU] = useState(""); // State for SKU search
  const [showFilters, setShowFilters] = useState(false); // State to manage visibility of filters

  useEffect(() => {
    fetchLoads();
    fetchCategoryOptions(); 
  }, [selectedCategory, filterBy]); // Dependencies include selectedCategory and filterBy

  const fetchLoads = async () => {
    try {
      const response = await adminApiInstance.get('/getloads');
      setLoads(response.data);
    } catch (error) {
      console.error('Error fetching loads:', error);
    }
  };

  const fetchCategoryOptions = async () => {
    try {
      const response = await adminApiInstance.get('/categories');
      setCategoryOptions(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleDelete = async (loadId) => {
    try {
      await adminApiInstance.delete(`/loads/${loadId}`);
      setLoads(loads.filter(load => load._id !== loadId));
      Swal.fire({
        type: "success",
        title: "Deleted!",
        text: "Your load has been deleted.",
        confirmButtonClass: "btn btn-success",
      });
    } catch (error) {
      console.error('Error deleting load:', error);
      Swal.fire({
        type: "error",
        title: "Error!",
        text: "Failed to delete load. Please try again later.",
        confirmButtonClass: "btn btn-danger",
      });
    }
  };

  const handleBarcodeClick = (load) => {
    setSelectedLoad(load);
  };

  const handleFilterByChange = (filterOption) => {
    setFilterBy(filterOption);
    setShowFilters(true); // Show filters when a dropdown item is clicked
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };

  const handleLoadNumberSearch = (e) => {
    setSearchLoadNumber(e.target.value);
  };

  const handleLoadBrandSearch = (e) => {
    setSearchLoadBrand(e.target.value);
  };

  const handleLoadSKUSearch = (e) => {
    setSearchLoadSKU(e.target.value);
  };

  const clearFilters = () => {
    setFilterBy(null);
    setSelectedCategory(null);
    setSearchLoadNumber("");
    setSearchLoadBrand("");
    setSearchLoadSKU("");
    setShowFilters(false); // Hide filters when clear filter is clicked
  };

  const filterLoadsByCategory = () => {
    let filtered = loads;

    if (selectedCategory) {
      filtered = filtered.filter(load => load.category && load.category._id === selectedCategory);
    }
  
    // Filter by load number if filterBy is set to "Load Number"
    if (filterBy === 'Load Number' && searchLoadNumber) {
      filtered = filtered.filter(load => load.loadNumber.toString().includes(searchLoadNumber));
    }

    return filtered;
  };

  const filterLoadsByBrand = () => {
    let filtered = loads;

    // Filter by brand name
    if (filterBy === 'Brand' && searchLoadBrand) {
      filtered = filtered.filter(load => {
        if (load.brands && load.brands.length > 0) {
          return load.brands.some(brand => brand.brandName.includes(searchLoadBrand));
        }
        return false;
      });
    }

    return filtered;
  };

  const filterLoadsBySKU = () => {
    let filtered = loads;

    // Filter by SKU
    if (filterBy === 'SKU' && searchLoadSKU) {
      filtered = filtered.filter(load => load.skuNumber && load.skuNumber.includes(searchLoadSKU));
    }

    return filtered;
  };

  useEffect(() => {
    let filteredLoads = filterLoadsByCategory();

    if (filterBy === 'Brand') {
      const brandFilteredLoads = filterLoadsByBrand();
      filteredLoads = brandFilteredLoads.length > 0 ? brandFilteredLoads : filteredLoads;
    } else if (filterBy === 'SKU') {
      const skuFilteredLoads = filterLoadsBySKU();
      filteredLoads = skuFilteredLoads.length > 0 ? skuFilteredLoads : filteredLoads;
    }

    setFilteredLoads(filteredLoads);
  }, [loads, selectedCategory, searchLoadNumber, searchLoadBrand, searchLoadSKU]); // Update filteredLoads whenever loads, selectedCategory, searchLoadNumber, searchLoadBrand, or searchLoadSKU changes

  const columns = [
    {
      title: "Load Number",
      dataIndex: "loadNumber",
      sorter: (a, b) => a.loadNumber - b.loadNumber,
    },
    {
      title: "Load Cost",
      dataIndex: "loadCost",
      sorter: (a, b) => a.loadCost - b.loadCost,
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (category) => category ? category.name : "",
      sorter: (a, b) => a.category && b.category ? a.category.name.localeCompare(b.category.name) : 0,
    },
    {
      title: "Pallets Count",
      dataIndex: "palletsCount",
      sorter: (a, b) => a.palletsCount - b.palletsCount,
    },
    {
      title: "Actions",
      render: (text, record) => (
        <>
          <Link className="me-3" to={`/dream-pos/product/product-details/${record._id}`}>
            <img src={EyeIcon} alt="img" />
          </Link>
          <img src={Printer} alt="Printer" onClick={() => handleBarcodeClick(record)} />
          <Link className="confirm-text me-3 lspace" to="#" onClick={() => handleDelete(record._id)}>
            <img src={DeleteIcon} alt="img" />
          </Link>
        </>
      ),
    },
  ];
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const onShowSizeChange = (current, pageSize) => {
    console.log("Current page:", current, "Page size:", pageSize);
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Load List</h4> 
              <h6>Manage your loads</h6>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <DropdownButton id="dropdown-basic-button" title="FilterBy">
                  <Dropdown.Item onClick={() => handleFilterByChange('Load Number')}>
                    Load Number
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleFilterByChange('Category')}>
                    Category
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleFilterByChange('Brand')}>
                    Brand
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleFilterByChange('SKU')}>
                    SKU
                  </Dropdown.Item>
                </DropdownButton>

                {showFilters && ( // Show filters only if showFilters is true
                  <>
                    {filterBy === 'Category' ? (
                      <select
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        style={{ marginLeft: '10px', padding:"4px", borderRadius:"10px"  }} 
                      >
                        <option value="">Select Category</option>
                        {categoryOptions.map(category => (
                          <option key={category._id} value={category._id}>{category.name}</option>
                        ))}
                      </select>
                    ) : filterBy === 'Load Number' ? (
                      <input
                        type="text"
                        placeholder={`Search by ${filterBy}`}
                        value={searchLoadNumber}
                        onChange={handleLoadNumberSearch}
                        style={{ marginLeft: '10px', padding:"4px", borderRadius:"10px" }} 
                      />
                    ) : filterBy === 'Brand' ? (
                      <input
                        type="text"
                        placeholder={`Search by ${filterBy}`}
                        value={searchLoadBrand}
                        onChange={handleLoadBrandSearch}
                        style={{ marginLeft: '10px', padding:"4px", borderRadius:"10px"  }} 
                      />
                    ) : filterBy === 'SKU' ? (
                      <input
                        type="text"
                        placeholder={`Search by ${filterBy}`}
                        value={searchLoadSKU}
                        onChange={handleLoadSKUSearch}
                        style={{ marginLeft: '10px', padding:"4px", borderRadius:"10px"  }} 
                      />
                    ) : (
                      <input
                        type="text"
                        placeholder={`Search by ${filterBy}`}
                        onChange={(e) => {
                          console.log(`Searching by ${filterBy}:`, e.target.value);
                        }}
                        style={{ marginLeft: '10px', padding:"4px", borderRadius:"10px"  }} 
                      />
                    )}
                    <button className="btn btn-secondary ms-2" onClick={clearFilters} style={{padding:"4px 19px", backgroundColor:"red"}}><MdOutlineClear /></button>
                  </>
                )}
              </div>
              <div className="table-responsive">
                <Table
                  className="table datanew dataTable no-footer"
                  rowSelection={rowSelection}
                  columns={columns}
                  dataSource={filteredLoads}
                  pagination={{
                    showTotal: (total, range) => `${range[0]} to ${range[1]} of ${total} items`,
                    showSizeChanger: true,
                    onShowSizeChange: onShowSizeChange,
                  }}
                  rowKey={(record) => record._id}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedLoad && (
        <GenerateBarcodePopUp
          load={selectedLoad}
          onClose={() => setSelectedLoad(null)}
        />
      )}
    </>
  );
};

export default ProductList;