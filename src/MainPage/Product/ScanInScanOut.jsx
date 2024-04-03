/* eslint-disable no-dupe-keys */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Table from "../../EntryFile/datatable";
import { Link } from "react-router-dom";
import { PlusIcon } from "../../EntryFile/imagePath";
import { adminApiInstance } from "../../api/axios";
import { BsUpcScan } from "react-icons/bs";
import UpdateDetailsModal from "./UpdateDetailsModal";

const ScanInScanOut = () => {
  const [data, setData] = useState([]);
  const [detail, setDetail] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await adminApiInstance.get("/getLoads?type=scans");
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "Sku",
      dataIndex: "skuNumber",
      sorter: (a, b) => a.skuNumber.length - b.skuNumber.length,
    },
    {
      title: "Load Number",
      dataIndex: "loadNumber",
      sorter: (a, b) => a.loadNumber.length - b.loadNumber.length,
    },
    {
      title: "Load Cost",
      dataIndex: "loadCost",
      sorter: (a, b) => a.loadCost - b.loadCost,
      width: "125px",
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (category) => category?.name, 
      sorter: (a, b) => a.category?.name.localeCompare(b.category?.name),
      width: "125px",
    },
    {
      title: "Scan In",
      dataIndex: "palletsCount",
      render: (text, record) => (
        <span className="badges bg-lightyellow">{text}</span>
      ),
      sorter: (a, b) => a.palletsCount - b.palletsCount,
    },
    {
      title: "Scan Out",
      dataIndex: "remainingPalletsCount",
      render: (text, record) => (
        <span className="badges bg-lightgreen">{text}</span>
      ),
      sorter: (a, b) => a.remainingPalletsCount - b.remainingPalletsCount,
      width: "120px",
    },
    {
      title: "Action",
      render: (_, record) => (
        <>
          <button
            className="me-3 mb-2"
            style={{ border: "none", background: "none", cursor: "pointer" }}
            onClick={() => {
              setDetail(record);
            }}
          >
            <BsUpcScan size="26" color="#0dcaf0" />
          </button>
        </>
      ),
    },
  ];

  const handleUpdate = async (date, count) => {
    try {
      await adminApiInstance.post("/updateUsedLoad", {
        load: date._id,
        remainingPalletsCount: Number(date.remainingPalletsCount),
        usedPalletsCount: count,
      });
      // Fetch updated data after the update
      const response = await adminApiInstance.get("/getLoads?type=scans");
      setData(response.data);
    } catch (error) {
      console.error("Error updating pallets count:", error);
    }
  };

  const handleClose = () => {
    setDetail(null);
  };

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Purchase List</h4>
              <h6>Manage your Purchase</h6>
            </div>
           
          </div>
          <div className="card">
            <div className="card-body">
              <div className="table-responsive">
                <Table
                  columns={columns}
                  dataSource={data}
                  rowKey={(record) => record._id}
                  className="dark-theme-table"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {detail && (
        <UpdateDetailsModal
          onCancel={handleClose}
          onUpdate={handleUpdate}
          data={detail}
        />
      )}
    </>
  );
};

export default ScanInScanOut;
