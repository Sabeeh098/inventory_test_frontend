import React, { useState, useEffect, useRef } from "react";
import { adminApiInstance } from "../../api/axios";
import FeatherIcon from "feather-icons-react";
import { toast } from "react-toastify";

const AddCategory = () => {
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [loadDetails, setLoadDetails] = useState(null);
  const [allLoads, setAllLoads] = useState([]);
  const [palletsCountToUse, setPalletsCountToUse] = useState(0);

  const barcodeInputRef = useRef(null);

  useEffect(() => {
    fetchAllLoads();
  }, []);

  const fetchAllLoads = async () => {
    try {
      const response = await adminApiInstance.get("/getloads");
      setAllLoads(response.data);
    } catch (error) {
      console.error("Error fetching loads:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const skuToSearch = scannedBarcode || "";
      const foundLoad = allLoads.find(
        (load) =>
          load.skuNumber === skuToSearch ||
          (load.brands &&
            load.brands.some((brand) => brand.skuCode === skuToSearch))
      );

      if (foundLoad) {
        setLoadDetails(foundLoad);
      } else {
        console.error("Load not found for SKU code:", skuToSearch);
      }
    } catch (error) {
      console.error("Error searching for load details:", error);
    }
  };

  const handleSearchIconClick = () => {
    handleSearch();
  };

  const handlePalletsCountChange = (e) => {
    setPalletsCountToUse(parseInt(e.target.value, 10) || 0);
  };

  const handleUpdateAndSubmit = async () => {
    try {
      if (
        loadDetails.palletsCount <
        loadDetails.remainingPalletsCount + Number(palletsCountToUse)
      ) {
        toast.error(
          "Pallet Count should be less than Pallets and Balance Out Pallets"
        );
        return;
      }

      await adminApiInstance.post("/updateUsedLoad", {
        load: loadDetails._id,
        remainingPalletsCount: loadDetails.remainingPalletsCount,
        usedPalletsCount: palletsCountToUse,
      });

      const response = await adminApiInstance.get(
        `/getLoadDetailsBySkuCode/${scannedBarcode}`
      );
      const updatedDetails = response.data;

      setLoadDetails(updatedDetails);

      setScannedBarcode("");
      setPalletsCountToUse(0);

      console.log("Pallets count updated successfully!");
    } catch (error) {
      console.error("Error updating pallets count:", error);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Import Products</h4>
            <h6>Bulk upload your products</h6>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <div className="row">
              <div className="col-lg-3 col-sm-6 col-12">
                <div className="form-group">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Scan or Enter SKU Code"
                      ref={barcodeInputRef}
                      value={scannedBarcode}
                      onChange={(e) => setScannedBarcode(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleSearchIconClick}
                    >
                      <FeatherIcon icon="search" size="20" />
                    </button>
                  </div>
                </div>
                <div className="form-group mt-3">
                  <label htmlFor="palletsCount">Enter Pallets Count:</label>
                  <input
                    type="number"
                    id="palletsCount"
                    className="form-control"
                    value={palletsCountToUse}
                    onChange={handlePalletsCountChange}
                  />
                </div>
              </div>
              <div className="col-lg-12"></div>
              <div className="col-lg-6 col-sm-12">
                <div className="productdetails productdetailnew">
                  <ul className="product-bar">
                    <li>
                      <h4>Load Number</h4>
                      <h6 className="manitorygreen">
                        {loadDetails?.loadNumber || "Loading..."}
                      </h6>
                      </li>
                      <li>
                      <h4>Category</h4>
                      <h6 className="manitorygreen">
                        {loadDetails?.category.name || "Loading..."}
                      </h6>
                    </li>
                    <li>
                      <h4>SKU code</h4>
                      <h6 className="manitorygreen">
                        {loadDetails?.skuNumber || "Loading..."}
                      </h6>
                    </li>
                    <li>
                      <h4>Load Cost</h4>
                      <h6 className="manitorygreen">
                        {loadDetails?.loadCost || "Loading..."}
                      </h6>
                    </li>
                    <li>
                      <h4>Load Date</h4>
                      <h6 className="manitorygreen">
                        {loadDetails?.loadDate || "Loading..."}
                      </h6>
                    </li>
                    <li>
                      <h4>Pallets</h4>
                      <h6 className="manitorygreen">
                        {loadDetails?.palletsCount || "Loading..."}
                      </h6>
                    </li>
                    <li>
                      <h4>Balance Out Pallets</h4>
                      <h6 className="manitorygreen">
                        {loadDetails?.remainingPalletsCount || 0}
                      </h6>
                    </li>
                    <li>
                      <h4>Per Pallet Price</h4>
                      <h6 className="manitoryblue">
                        {loadDetails?.perPalletCost || "Field optional"}
                      </h6>
                    </li>
                    {loadDetails?.brands && (
                      <li>
                        <h4>Brand Name</h4>
                        <h6 className="manitoryblue">
                          {loadDetails?.brands[0]?.brandbrandName ||
                            "Brand not available"}
                        </h6>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
              <div className="bar-code-view" style={{ width: '321px' }}> 
                {scannedBarcode && <p>Scanned Barcode: {scannedBarcode}</p>}
                {loadDetails?.barcodeImage && (
                  <img
                    src={loadDetails?.barcodeImage}
                    alt="Barcode"
                    ref={barcodeInputRef}
                  />
                )}
                {loadDetails?.brands[0]?.barcodeImage && (
                  <img
                    src={loadDetails?.brands[0]?.barcodeImage}
                    alt="Brand Barcode"
                    ref={barcodeInputRef}
                  />
                )}
                {!loadDetails?.barcodeImage &&
                  !loadDetails?.brands[0]?.barcodeImage && (
                    <img
                      src="https://t4.ftcdn.net/jpg/02/28/23/91/240_F_228239110_4eEmhcqbUpZG8y1x1aazFBQMVmbGjoce.jpg"
                      alt="Dummy Barcode"
                      ref={barcodeInputRef}
                    />
                  )}
              </div>
              <div className="col-lg-12">
                <div className="form-group mb-0">
                  <button
                    className="btn btn-submit me-2"
                    onClick={handleUpdateAndSubmit}
                    disabled={!scannedBarcode || palletsCountToUse <= 0}
                  >
                    Update and Submit
                  </button>
                  <button href="#" className="btn btn-cancel">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCategory;

                   
