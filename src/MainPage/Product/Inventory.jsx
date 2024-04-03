import React, { useState, useEffect } from "react";
import Table from "../../EntryFile/datatable";

import "react-datepicker/dist/react-datepicker.css";

import "react-select2-wrapper/css/select2.css";
import { adminApiInstance } from "../../api/axios";

const Inventory = () => {
  const [loads, setLoads] = useState([]);
  const fetchLoads = async () => {
    try {
      const response = await adminApiInstance.get("/getLoads?type=indicators");
      console.log(response.data,"Dataa");
      const filteredLoads = response.data.filter(
        (item) => item.palletsCount <= 5 && item.remainingPalletsCount <= 5
        );
        console.log(filteredLoads,"Dataa Verruundo?");
      setLoads(filteredLoads);
    
    } catch (error) {
      console.error("Error fetching loads:", error);
    }
  };

  useEffect(() => {
    fetchLoads();
  }, []);
  

  const columns = [
    {
      title: "Load Number",
      dataIndex: "loadNumber",
      sorter: (a, b) => a.loadNumber.length - b.loadNumber.length,
    },
    {
      title: "SKU Number",
      dataIndex: "skuNumber",
      sorter: (a, b) => a.skuNumber.length - b.skuNumber.length,
    },
    {
      title: "Load Cost",
      dataIndex: "loadCost",
      sorter: (a, b) => a.loadCost - b.loadCost,
    },
    {
      title: "Pallets Count",
      dataIndex: "palletsCount",
      sorter: (a, b) => a.palletsCount - b.palletsCount,
    },
    {
      title: "Remaining Pallets Count",
      dataIndex: "remainingPalletsCount",
      sorter: (a, b) => a.remainingPalletsCount - b.remainingPalletsCount,
      render: (text, record) => {
        if (record.remainingPalletsCount <= 5) {
          return (
            <span style={{ color: 'red' }}>
              {text} (Please reorder this load)
            </span>
          );
        }
        return text;
      }
    },
    // Include other fields based on your requirements
    // Add more columns as needed
  ];
  

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Inventory Report</h4>
            <h6>Manage your Inventory Report</h6>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="table-top">
              <div className="search-set"></div>
              
            </div>
            <div className="table-responsive">
              <Table
                columns={columns}
                dataSource={loads}
                rowKey={(record) => record._id}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
