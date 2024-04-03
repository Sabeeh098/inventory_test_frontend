/* eslint-disable no-constant-condition */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { withRouter, useHistory, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { Scrollbars } from "react-custom-scrollbars";
import FeatherIcon from "feather-icons-react";
import { useStorage } from "../../constants/storage.tsx";
import { MdDashboardCustomize, MdOutlineImportExport } from "react-icons/md";
import { AiFillDashboard } from "react-icons/ai";
import { ImBoxAdd } from "react-icons/im";
import { FaClipboardList } from "react-icons/fa";
import { BsAppIndicator } from "react-icons/bs";
import { TbReport, TbScan, TbScanEye } from "react-icons/tb";
import { IoMdPersonAdd, IoMdSettings } from "react-icons/io";
import { PiUserListBold } from "react-icons/pi";
import { TbZoomScan } from "react-icons/tb";
import { LuLogOut } from "react-icons/lu";
import { BsDatabaseFillAdd } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import { MdCategory } from "react-icons/md";

const Sidebar = (props) => {
  const { getItem } = useStorage();
  const [isSideMenu, setSideMenu] = useState("");
  const [role, setRole] = useState("");
  const [permissions, setPermissions] = useState("");
  const history = useHistory();
const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (permissions && Object.keys(permissions).length > 0) {
      setHasPermission(Object.keys(permissions).some((permission) => permission === "loads" || permission === "pallets" || permission === "purchase" || permission === "users" || permission === "reports"));
    }
  }, [permissions]);


  useEffect(() => {
    getItem("user").then((value) => {
      if (value) {
        setRole(value.role);
        let permissions = {};
        for (let item of value.permissions) {
          permissions[item.name] = item.view;
        }
        setPermissions(permissions);
      } else {
        history.push(`/signIn`);
      }
    });
  }, []);

  const toggleSidebar = (value) => {
    setSideMenu(value);
  };
  const expandMenu = () => {
    document.body.classList.remove("expand-menu");
  };
  const expandMenuOpen = () => {
    document.body.classList.add("expand-menu");
  };
  const pageRefresh = (url, page) => {
    history.push(`/dream-pos/${url}/${page}`);
    window.location.reload();
  };
  const location = useLocation();
  let pathname = location.pathname;

  useEffect(() => {
    document.querySelector(".main-wrapper").classList.remove("slide-nav");
    document.querySelector(".sidebar-overlay").classList.remove("opened");
    document.querySelector(".sidebar-overlay").onclick = function () {
      this.classList.remove("opened");
      document.querySelector(".main-wrapper").classList.remove("slide-nav");
    };
  }, [pathname]);
  const exclusionArray = [
    "/reactjs/template/dream-pos/index-three",
    "/reactjs/template/dream-pos/index-four",
    "/reactjs/template/dream-pos/index-two",
    "/reactjs/template/dream-pos/index-one",
  ];
  if (exclusionArray.indexOf(window.location.pathname) >= 0) {
    return "";
  }

  const iconSize = "3em"; // Set the desired size here

  return (
    <>
     <div
  className={`sidebar index-4 ${
    pathname.includes("/index-three") ? "d-none" : ""
  } ${!hasPermission ? "full-height" : ""}`}
  id="sidebar"
  style={{ height: !hasPermission ? "100vh" : "" }}
>
        <Scrollbars>
         <div className="slimScrollDiv" style={{ height: !hasPermission ? `calc(100vh - 50px)` : "" }}>
            <div className="sidebar-inner slimscroll">
              <div
                id="sidebar-menu"
                className="sidebar-menu"
                onMouseOver={expandMenuOpen}
                onMouseLeave={expandMenu}
              >
                <ul>
                  {role == "admin" && (
                    <li className="submenu-open">
                      <h6 className="submenu-hdr">Main</h6>
                      <ul>
                        <li
                          className={
                            pathname.includes("dashboard") ? "active" : ""
                          }
                        >
                          <Link to="/dream-pos/dashboard">
                            <AiFillDashboard color="FFFF00" size={iconSize} />
                            <span>Dashboard</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  )}
                  <li className="submenu-open">
                    <h6 className="submenu-hdr">Products</h6>
                    <ul>
                      {(role == "admin" || permissions.loads) && (
                        <li
                          className={
                            pathname.includes("add-loads") ? "active" : ""
                          }
                        >
                          <Link
                            className={
                              pathname.includes("add-loads-") ? "active" : ""
                            }
                            to="/dream-pos/product/add-loads"
                          >
                            <BsDatabaseFillAdd color="FFFF00" size={iconSize} />
                            <span>Add Loads</span>
                          </Link>
                        </li>
                      )}
                      <li
                      className={
                        pathname.includes("addCategory")
                          ? "active"
                          : ""
                      }
                    >
                      <Link
                        className={
                          pathname.includes("addCategory-") ? "active" : ""
                        }
                        to="/dream-pos/product/addCategory"
                      >
                        <MdCategory color="FFFF00" size={iconSize} />
                        <span>Add Category</span>
                      </Link>
                    </li>
                      {(role == "admin" || permissions.loads) && (
                        <li
                          className={
                            pathname.includes("list-loads") ? "active" : ""
                          }
                        >
                          <Link
                            className={
                              pathname.includes("list-loads-") ? "active" : ""
                            }
                            to="/dream-pos/product/list-loads"
                          >
                            <FaThList color="FFFF00" size={iconSize} />
                            <span>List Loads</span>
                          </Link>
                        </li>
                      )}
                      {(role == "admin" || permissions.pallets) && (
                        <li
                          className={
                            pathname.includes("add-pallets") ? "active" : ""
                          }
                        >
                          <Link
                            className={
                              pathname.includes("add-pallets-") ? "active" : ""
                            }
                            to="/dream-pos/product/add-pallets"
                          >
                            <TbScan color="FFFF00" size={iconSize} />
                            <span>Scan Barcode</span>
                          </Link>
                        </li>
                      )}
                    </ul>
                  </li>
                  {(role == "admin" || permissions.purchase) && (
                    <li className="submenu-open">
                      <h6 className="submenu-hdr">Report</h6>
                      <ul>
                        <li
                          className={
                            pathname.includes("purchaseorderreport")
                              ? "active"
                              : ""
                          }
                        >
                          <Link
                            to="/dream-pos/product/purchaseorderreport"
                            className={
                              pathname.includes("purchaseorderreport")
                                ? "active"
                                : ""
                            }
                          >
                            <TbReport color="FFFF00" size={iconSize} />
                            <span>Purchase Order</span>
                          </Link>
                        </li>
                        <li
                          className={
                            pathname.includes("Load-Report")
                              ? "active"
                              : ""
                          }
                        >
                          <Link
                            to="/dream-pos/product/Load-Report"
                            className={
                              pathname.includes("Load-Report")
                                ? "active"
                                : ""
                            }
                          >
                            <TbReport color="FFFF00" size={iconSize} />
                            <span>Pallet Out Report</span>
                          </Link>
                        </li>
                        <li
                          className={
                            pathname.includes("InventoryIndicators")
                              ? "active"
                              : ""
                          }
                        >
                          <Link
                            to="/dream-pos/product/InventoryIndicators"
                            className={
                              pathname.includes("InventoryIndicators")
                                ? "active"
                                : ""
                            }
                          >
                            <BsAppIndicator color="FFFF00" size={iconSize} />
                            <span>Inventory Indicators</span>
                          </Link>
                        </li>
                        <li
                          className={
                            pathname.includes("/ScanInScanOut") ? "active" : ""
                          }
                        >
                          <Link
                            to="/dream-pos/product/ScanInScanOut"
                            className={
                              pathname.includes("salesreport") ? "active" : ""
                            }
                          >
                            <TbScanEye color="FFFF00" size={iconSize} />
                            <span>Scan In & Scan Out</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  )}
                  {(role == "admin" || permissions.users) && (
                    <li className="submenu-open">
                      <h6 className="submenu-hdr">Users</h6>
                      <ul>
                        <li
                          className={
                            pathname.includes("add-User") ? "active" : ""
                          }
                        >
                          <Link
                            className={
                              pathname.includes("add-User") ? "active" : ""
                            }
                            to="/dream-pos/product/add-User"
                          >
                            <IoMdPersonAdd color="FFFF00" size={iconSize} />
                            <span>Add Users</span>
                          </Link>
                        </li>
                        <li
                          className={
                            pathname.includes("Users-List") ? "active" : ""
                          }
                        >
                          <Link
                            className={
                              pathname.includes("Users-List") ? "active" : ""
                            }
                            to="/dream-pos/product/Users-List"
                          >
                            <PiUserListBold color="FFFF00" size={iconSize} />
                            <span>Users List</span>
                          </Link>
                        </li>
                      </ul>
                    </li>
                  )}
                
                  <li className="submenu-open">
                    <h6 className="submenu-hdr">Settings</h6>
                    <ul>
                      {/* <li className="submenu">
                        <Link
                          to="#"
                          className={
                            pathname.includes("/dream-pos/settings")
                              ? "subdrop active"
                              : "" || isSideMenu == "Settings"
                              ? "subdrop active"
                              : ""
                          }
                          onClick={() =>
                            toggleSidebar(
                              isSideMenu == "Settings" ? "" : "Settings"
                            )
                          }
                        >
                          <IoMdSettings color="FFFF00" size={iconSize} />
                          <span> Settings</span>{" "}
                          <span className="menu-arrow" />
                        </Link>
                        {/* {isSideMenu == "Settings" ? (
                          // <ul>
                          //   {/* <li>
                          //     <Link
                          //       to="/dream-pos/settings/generalsettings"
                          //       className={
                          //         pathname.includes("generalsettings")
                          //           ? "active"
                          //           : ""
                          //       }
                          //     >
                          //       General Settings
                          //     </Link>
                          //   </li> */}
                             {/* Add similar list items for other settings */}
                          {/* // </ul> */}
                        {/* ) : ( */}
                       
                        {/* )} */} 
                      {/* </li> */}
                      <li>
                        <Link
                          to="/signIn"
                          className={
                            pathname.includes("signIn") ? "active" : ""
                          }
                        >
                          <LuLogOut color="FFFF00" size={iconSize} />
                          <span>Logout</span>{" "}
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Scrollbars>
      </div>
    </>
  );
};

export default withRouter(Sidebar);
