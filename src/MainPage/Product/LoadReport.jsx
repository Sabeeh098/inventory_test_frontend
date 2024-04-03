import React, { useState, useEffect, useRef } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import './productList.css';
import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from 'react-date-range';
import { adminApiInstance } from '../../api/axios';
import { enGB } from 'date-fns/locale'; 
import PalletOutReport from './PalletOutReport';

const PurchaseOrder1 = () => {
  const [datePicker, setDatepicker] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Weekly');
  const [tableData, setTableData] = useState([]);
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [showSearchInput, setShowSearchInput] = useState(false); 
  const [categories, setCategories] = useState([]); 
  const [loadNumber, setLoadNumber] = useState('');
  const [brand, setBrand] = useState('');
  const [sku, setSku] = useState('');

  const dateRangePickerRef = useRef();
  const searchInputRef = useRef(); 
  const categoryDropdownRef = useRef(); 

  useEffect(() => {
    getAllCategories();
  }, []);

  const getAllCategories = async () => {
    try {
      const response = await adminApiInstance.get("/categories");
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleCategorySelect = async (categoryId) => {
    try {
      const response = await adminApiInstance.post("/fetchReportByCategory", { categoryId });
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching report data:', error);
    }
  };

  const handleDateRangeChange = async (ranges) => {
    const startDateUTC = ranges.selection.startDate.toISOString();
    const endDateUTC = ranges.selection.endDate.toISOString();
    const utcRanges = {
      startDate: startDateUTC,
      endDate: endDateUTC,
      key: 'selection'
    };
  
    setDateRange([ranges.selection]);
    try {
      const response = await adminApiInstance.post("/fetchDataForDateRange", utcRanges);
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching data for the selected date range:', error);
    }
  };

  const handleClickOutside = (event) => {
    if (searchInputRef.current && !searchInputRef.current.contains(event.target)) {
      setShowSearchInput(false); 
    }
    if (dateRangePickerRef.current && !dateRangePickerRef.current.contains(event.target)) {
      setDatepicker(false); 
    }
  };

  const datePickerFnc = () => {
    setDatepicker(!datePicker);
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchData(selectedOption); 
  }, [selectedOption]); 

  const fetchData = async (option) => {
    try {
      let response;
      switch(option) {
        case 'Daily':
          response = await adminApiInstance.get('/dailyData');
          break;
        case 'Weekly':
          response = await adminApiInstance.get('/fetchWeekly');
          break;
        case 'Monthly':
          response = await adminApiInstance.get("/monthlyData");
          break;
        case 'Yearly':
          response = await adminApiInstance.get("/yearlyData");
          break;
        default:
          break;
      }
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleOptionChange = (option) => {
    setSelectedOption(option);
    if (option === 'Category' || option === 'Brand' || option === 'Load Number' || option === 'SKU') {
      setShowSearchInput(true); 
    } else {
      setShowSearchInput(false);
    }
  };

  const formatWeeklyDate = (startDate, endDate) => {
    const startMonth = startDate.getMonth() + 1;
    const startDay = startDate.getDate();
    const endMonth = endDate.getMonth() + 1;
    const endDay = endDate.getDate();
    return `${startMonth}/${startDay}-${endMonth}/${endDay}`;
  };

  const handleLoadNumberChange = (event) => {
    setLoadNumber(event.target.value);
  };

  const handleBrandChange = (event) => {
    setBrand(event.target.value);
  };

  const handleSkuChange = (event) => {
    setSku(event.target.value);
  };

  const handleLoadNumberSubmit = async () => {
    try {
      const response = await adminApiInstance.post("/fetchReportByLoadNumber", { loadNumber });
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching report data by load number:', error);
    }
  };

  const handleBrandSubmit = async () => {
    try {
     
      const response = await adminApiInstance.post("/fetchReportByBrand", { brand });
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching report data by brand:', error);
    }
  };

  const handleSkuSubmit = async () => {
    try {
      const response = await adminApiInstance.post("/fetchReportBySku", { sku });
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching report data by SKU:', error);
    }
  };

  return (
    <>
      <div className="wholeComp">
        <div className="Porder">
          <h3>Pallet Out Report</h3>
          <h5>Manage your Pallet Out Report</h5>
        </div>
        <div className="twoDropdown align-items-center">
          <DropdownButton title="Summary" className="drop5">
            <Dropdown.Item href="#/action-1" onClick={() => handleOptionChange('Daily')}>Daily</Dropdown.Item>
            <Dropdown.Item href="#/action-2" onClick={() => handleOptionChange('Weekly')}>Weekly</Dropdown.Item>
            <Dropdown.Item href="#/action-3" onClick={() => handleOptionChange('Monthly')}>Monthly</Dropdown.Item>
            <Dropdown.Item href="#/action-3" onClick={() => handleOptionChange('Yearly')}>Yearly</Dropdown.Item>
          </DropdownButton>

          <DropdownButton id="dropdown-basic-button" title="FilterBy">
            <Dropdown.Item href="#/action-2" onClick={() => handleOptionChange('Load Number')}>
              Load Number
            </Dropdown.Item>
            <Dropdown.Item href="#/action-2" onClick={() => handleOptionChange('Category')}>
              Category
            </Dropdown.Item>
            <Dropdown.Item href="#/action-2" onClick={() => handleOptionChange('Brand')}>
              Brand
            </Dropdown.Item>
            <Dropdown.Item href="#/action-2" onClick={() => handleOptionChange('SKU')}>
              SKU
            </Dropdown.Item>
          </DropdownButton>

          {showSearchInput && selectedOption === 'Category' && (
            <div ref={categoryDropdownRef}>
              <select className="inputFilterBY" onChange={(e) => handleCategorySelect(e.target.value)}
              style={{padding:"6px"}}>
                <option value="">Select category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>{category.name}</option>
                ))}
              </select>
            </div>
          )}

          {showSearchInput && (selectedOption === 'Load Number' || selectedOption === 'Brand' || selectedOption === 'SKU') && (
            <div>
              <input 
                type="text" 
                style={{padding:"4px"}}
                placeholder={selectedOption === 'Load Number' ? 'Enter Load Number' : selectedOption === 'Brand' ? 'Enter Brand' : 'Enter SKU'} 
                value={selectedOption === 'Load Number' ? loadNumber : selectedOption === 'Brand' ? brand : sku} 
                onChange={selectedOption === 'Load Number' ? handleLoadNumberChange : selectedOption === 'Brand' ? handleBrandChange : handleSkuChange}
                onKeyPress={(event) => {
                  if (event.key === 'Enter') {
                    if (selectedOption === 'Load Number') {
                      handleLoadNumberSubmit();
                    } else if (selectedOption === 'Brand') {
                      handleBrandSubmit();
                    } else {
                      handleSkuSubmit();
                    }
                  }
                }} 
              />
            </div>
          )}

          <div className="daterangepicker d-flex" onClick={datePickerFnc}>
            <div className="m-1 px-2 py-1 bg-light">
              <p>{dateRange[0].startDate.toLocaleDateString()}</p>
            </div>
            <div className="m-1 px-2 py-1 bg-light">
              <p>{dateRange[0].endDate.toLocaleDateString()}</p>
            </div>
          </div>

          {datePicker && (
            <div ref={dateRangePickerRef}>
              <DateRangePicker
                onChange={handleDateRangeChange}
                showSelectionPreview={true}
                moveRangeOnFirstSelection={false}
                months={1}
                ranges={dateRange}
                direction="horizontal"
                preventSnapRefocus={true}
                calendarFocus="backwards"
                locale={enGB}
              />
            </div>
          )}
        </div>

        {selectedOption === 'Weekly' && (
          <h4 className="Pdate">{formatWeeklyDate(dateRange[0].startDate, dateRange[0].endDate)}</h4>
        )}

        <PalletOutReport data={tableData} />
      </div>
    </>
  );
};

export default PurchaseOrder1;
