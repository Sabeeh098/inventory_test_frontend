import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { adminApiInstance } from "../../api/axios";
import { useReactToPrint } from "react-to-print";
import { TfiPrinter } from "react-icons/tfi";
import BrandDetails from "./BrandDetails";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [barcodeOnly, setBarcodeOnly] = useState(false);
  const [numCopies, setNumCopies] = useState(1);
  const loadDetailsRef = useRef();
  const loadBarcodeRef = useRef();

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      const response = await adminApiInstance.get(`/getLoadDetailsById/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };


  const handlePrintBrand = useReactToPrint({
    content: () => {
      if (barcodeOnly) {
        const PrintElem = document.createElement("div");
        PrintElem.className = "multi_print_only";
        for (let i = 0; i < numCopies; i++) {
          PrintElem.appendChild(loadBarcodeRef.current.cloneNode(true));
        }
        return PrintElem;
      } else {
        const PrintElem = document.createElement("div");
        PrintElem.className = "multi_print";
        for (let i = 0; i < numCopies; i++) {
          PrintElem.appendChild(loadDetailsRef.current.cloneNode(true));
        }
        return PrintElem;
      }
    }
  });

  const handleClickPrint = () => {
    if (numCopies > product.totalPallet) {
      console.error("Please enter copies less than or equal to total pallet count.");
    } else {
      handlePrintBrand();
    }
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="page-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="page-title">
            <h4>Product Details</h4>
            <h6>Full details of a product</h6>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-8 col-sm-12">
            <div className="card">
              <div className="card-body print_single" ref={loadDetailsRef}>
                <div className="productdetails">
                  <ul className="product-bar">
                    <li>
                      <h4>Category</h4>
                      <h6>{product.category?.name}</h6>
                    </li>
                    <li>
                      <h4>Load Cost</h4>
                      <h6>{product.loadCost}</h6>
                    </li>
                    <li>
                      <h4>Load Date</h4>
                      <h6>{formatDate(product.loadDate)}</h6>
                    </li>
                    <li>
                      <h4>Load Number</h4>
                      <h6>{product.loadNumber}</h6>
                    </li>
                    <li>
                      <h4>Pallets Count</h4>
                      <h6>{product.palletsCount}</h6>
                    </li>
                    <li>
                      <h4>Per Pallet Price</h4>
                      <h6>{product.perPalletCost}</h6>
                    </li>
                    <li>
                      <h4>SKU Number</h4>
                      <h6>{product.skuNumber}</h6>
                    </li>
                  </ul>
                </div>
                {product.barcodeImage && (
                  <div
                    className="bar-code-view print_single_barcode"
                    ref={loadBarcodeRef}
                  >
                    <img src={product.barcodeImage} alt="barcode" />
                  </div>
                )}
              </div>
              {product.barcodeImage && (
                <div style={{ marginTop: "10px", display: "flex", padding: "0 10px", alignItems: "center" }}>
                  <input checked={barcodeOnly} onChange={() => setBarcodeOnly(!barcodeOnly)} type="checkbox" />
                  <label style={{ marginLeft: "5px" }}>Print Barcode Only</label>
                  <input
                    type="number"
                    min="1"
                    value={numCopies}
                    onChange={(e) => setNumCopies(parseInt(e.target.value))}
                    style={{ marginLeft: "10px", width: "50px" }}
                  />
                  <label style={{ marginLeft: "5px" }}>Copies</label>
                  <div style={{ marginLeft: "auto" }}>
                    <button
                      onClick={handleClickPrint}
                      style={{
                        border: "1px solid #3498db",
                        borderRadius: "5px",
                        background: "#3498db",
                        color: "#fff",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        padding: "5px 10px",
                        marginBottom: "5px"
                      }}
                    >
                      <TfiPrinter style={{ marginRight: "5px" }} />
                      Print
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {product.brands && (
            <div className="col-lg-4 col-sm-12">
              <div className="card">
                <div className="card-body">
                  <div className="slider-product-details">
                    {product.brands.map((item, key) => (
                      <div key={key} id={`brand-details-${item.skuCode}`}>
                        <BrandDetails
                          item={item}
                          loadNumber={product.loadNumber}
                          category={product.category?.name}
                          ref={loadBarcodeRef}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
