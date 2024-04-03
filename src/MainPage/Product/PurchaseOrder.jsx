import React from "react";
import { useLocation } from "react-router-dom";

function PurchaseOrder() {
  const location = useLocation();
  const { report } = location.state; // Access the report data from location state

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Report Details</h4>
            <h6>Full details of a Report</h6>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8 col-sm-12">
            <div className="card">
              <div
                className="card-body print_single"
                style={{ listStyle: "none", padding: 0 }}
              >
                <div className="productdetails">
                  <ul className="product-bar">
                    <li>
                      <h4>Date</h4>
                      <h6>{report.addedAt}</h6>
                    </li>
                    <li>
                      <h4>Load Cost</h4>
                      <h6>{report.loadCost}</h6>
                    </li>
                    <li>
                      <h4>Load Number</h4>
                      <h6>{report.loadNumber}</h6>
                    </li>
                    <li>
                      <h4>Pallets Count</h4>
                      <h6>{report.palletsCount}</h6>
                    </li>
                    <li>
                      <h4>Pallets Out</h4>
                      <h6>{report.palletsOut}</h6>
                    </li>
                    <li>
                      <h4>Per Pallet Price</h4>
                      <h6>{report.perPalletCost}</h6>
                    </li>
                   
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PurchaseOrder;
