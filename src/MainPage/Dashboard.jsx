/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AvocatImage,
  Dash1,
  Dash2,
  Dash3,
  Dash4,
  Dropdown,
  OrangeImage,
  PineappleImage,
  EarpodIcon,
  StawberryImage,
  IphoneIcon,
  SamsungIcon,
  MacbookIcon,
} from "../EntryFile/imagePath";
import Table from "../EntryFile/datatables";
import Chart from "react-apexcharts";
import { Link } from "react-router-dom";
import FeatherIcon from "feather-icons-react";
import CountUp from "react-countup";
import { Helmet } from "react-helmet";
import RightSideBar from "../components/rightSidebar";
import { adminApiInstance } from "../api/axios";
// import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";

const Dashboard = () => {
  const [recentLoads, setRecentLoads] = useState([]);
  const [totalLoads, setTotalLoads] = useState(0);
  const [totalPallets, setTotalPallets] = useState(0);
  const [remainingPallets, setRemainingPallets] = useState(0);
  const [totalLoadCost, setTotalLoadCost] = useState(0);
  const [adminCount, setAdminCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  console.log(adminCount, employeeCount);

  /////Loads Details///////////
  const fetchTotalLoads = async () => {
    try {
      const response = await adminApiInstance.get("/totalLoads");
      console.log(response.data);
      setTotalLoads(response.data.totalLoadsCount);
    } catch (error) {
      console.error("Error fetching total loads:", error);
    }
  };

  const fetchTotalPallets = async () => {
    try {
      const response = await adminApiInstance.get("/totalPallets");
      console.log(response.data.totalPallets);
      setTotalPallets(response.data.totalPallets);
    } catch (error) {
      console.error("Error fetching total pallets:", error);
    }
  };

  const fetchRecentLoads = async () => {
    try {
      const response = await adminApiInstance.get("/recentLoad");

      const loadsWithIndex = response.data.map((load, index) => ({
        ...load,
        index: index + 1,
      }));
      setRecentLoads(loadsWithIndex);
    } catch (error) {
      console.error("Error fetching recent loads:", error);
    }
  };

  const fetchRemainingPallets = async () => {
    try {
      const response = await adminApiInstance.get("/totalRemainingPallets");
      setRemainingPallets(response.data.totalRemainingPallets);
    } catch (error) {
      console.error("Error fetching remaining pallets:", error);
    }
  };

  const fetchTotalLoadCost = async () => {
    try {
      const response = await adminApiInstance.get("/totalLoadCost");
      setTotalLoadCost(response.data.totalLoadCost);
    } catch (error) {
      console.error("Error fetching total loads cost:", error);
    }
  };

  ///////////////////////////////////////

  /////////Admin And Emplyee Detals //////////

  const fetchAdminAndEmployeeCounts = async () => {
    try {
      const response = await adminApiInstance.get("/fetchAdminAndEmployee");
      setAdminCount(response.data.adminCount);
      setEmployeeCount(response.data.employeeCount);
    } catch (error) {
      console.error("Error fetching admin and employee counts:", error);
    }
  };

  useEffect(() => {
    fetchRecentLoads();
    fetchTotalLoads();
    fetchTotalPallets();
    fetchRemainingPallets();
    fetchTotalLoadCost();
    fetchAdminAndEmployeeCounts();
  }, []);

  const expiredProductColumns = [
    {
      title: "SNo",
      dataIndex: "index", // Use the added index property
      sorter: (a, b) => a.index - b.index,
    },
    {
      title: "Load Number",
      dataIndex: "loadNumber",
      sorter: (a, b) => a.loadNumber.length - b.loadNumber.length,
    },
    {
      title: "Category",
      dataIndex: "category",
      render: (category) => category?.name, 
      sorter: (a, b) => a.category?.name.localeCompare(b.category?.name),
    },
    {
      title: "Load Date",
      dataIndex: "loadDate",
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <Helmet>
          <title>IO Ready Inventory Management Soft</title>
          <meta name="description" content="Dashboard page" />
        </Helmet>
        <div className="content">
          <div className="row">
            <div className="col-lg-3 col-sm-6 col-12">
              <Link to="/dream-pos/product/list-loads">
                <div className="dash-widget">
                  <div className="dash-widgetimg">
                    <span>
                      <img src={Dash1} alt="img" />
                    </span>
                  </div>
                  <div className="dash-widgetcontent">
                    <h5>{totalLoads}</h5>
                    <h6>Total Load</h6>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3 col-sm-6 col-12">
              <Link to="/dream-pos/product/list-loads">
                <div className="dash-widget dash1">
                  <div className="dash-widgetimg">
                    <span>
                      <img src={Dash2} alt="img" />
                    </span>
                  </div>
                  <div className="dash-widgetcontent">
                    <h5>{totalPallets}</h5>
                    <h6>Total Pallets</h6>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3 col-sm-6 col-12">
              <Link to="/dream-pos/product/purchaseorderreport">
                <div className="dash-widget dash2">
                  <div className="dash-widgetimg">
                    <span>
                      <img src={Dash3} alt="img" />
                    </span>
                  </div>
                  <div className="dash-widgetcontent">
                    <h5>{remainingPallets}</h5>
                    <h6>Remaining Pallets</h6>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3 col-sm-6 col-12">
              <Link to="/dream-pos/product/list-loads">
                <div className="dash-widget dash3">
                  <div className="dash-widgetimg">
                    <span>
                      <img src={Dash4} alt="img" />
                    </span>
                  </div>
                  <div className="dash-widgetcontent">
                    <h5>${totalLoadCost}</h5>
                    <h6>Total Load Costs</h6>
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 d-flex">
              <Link
                to="/dream-pos/product/Users-List"
                style={{ width: "100%", textDecoration: "none" }}
              >
                <div className="dash-count">
                  <div className="dash-counts">
                    <h4>{employeeCount}</h4>
                    <h5>Employees</h5>
                  </div>
                  <div className="dash-imgs">
                    <FeatherIcon icon="user" />
                  </div>
                </div>
              </Link>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 d-flex">
            <Link
                to="/dream-pos/product/Users-List"
                style={{ width: "100%", textDecoration: "none" }}
              >
              <div className="dash-count das1">
                <div className="dash-counts">
                  <h4>{adminCount}</h4>
                  <h5>Admins</h5>
                </div>
                <div className="dash-imgs">
                  <FeatherIcon icon="user-check" />
                </div>
              </div>
              </Link>
            </div>
            {/* <div className="col-lg-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das2">
                <div className="dash-counts">
                  <h4>100</h4>
                  <h5>Demo </h5>
                </div>
                <div className="dash-imgs">
                  <FeatherIcon icon="file-text" />
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-sm-6 col-12 d-flex">
              <div className="dash-count das3">
                <div className="dash-counts">
                  <h4>105</h4>
                  <h5>Demo </h5>
                </div>
                <div className="dash-imgs">
                  <FeatherIcon icon="file" />
                </div>
              </div>
            </div> */}
          </div>
          {/* Button trigger modal */}

          <div className="card mb-0">
            <div className="card-body">
              <h4 className="card-title">Recently Added Loads</h4>
              <div className="table-responsive dataview">
                <Table
                  columns={expiredProductColumns}
                  dataSource={recentLoads}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <RightSideBar />
    </>
  );
};

export default Dashboard;
