
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Form, Input, Modal, Checkbox } from "antd";

const GenerateBarcodePopUp = ({ load, onClose }) => {
  const [count, setCount] = useState(1);
  const [size, setSize] = useState(150);
  const [brand, setBrand] = useState(
    load.brands && load.brands.length > 0 ? load.brands[0] : null
  );
  const [printVertically, setPrintVertically] = useState(false); // State for vertical printing

  const handleChangeCount = (e) => setCount(parseInt(e.target.value, 10) || 1);
  const handleChangeSize = (e) => setSize(e.target.value);
  const handleChangeBrand = (e) => {
    const selectedBrand = load.brands.find(
      (brand) => brand.brandName === e.target.value
    );
    setBrand(selectedBrand);
  };

  useEffect(() => {
    if (load.brands && load.brands.length > 0) {
      setBrand(load.brands[0]);
    }
  }, [load]);

  const handlePrint = () => {
    const printableContent = document.getElementById("printable-barcodes").innerHTML;
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <html>
        <head>
          <title>Print Barcode</title>
          <style>
            .barcode-row {
              display: flex;
              flex-direction: ${printVertically ? "column" : "row"};
              align-items: center;
              justify-content: center;
              flex-wrap: wrap;
            }
            .barcode-item {
              margin: 5px;
            }
          </style>
        </head>
        <body>${printableContent}</body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  };

  const handleCheckboxChange = (e) => {
    setPrintVertically(e.target.checked);
  };

  return (
    <Modal
      visible={true}
      title={`Print Barcode for Load ${load.loadNumber}`}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="print" type="primary" onClick={handlePrint}>
          Print
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Number of Barcodes:">
          <Input
            type="number"
            min={1}
            value={count}
            onChange={handleChangeCount}
          />
        </Form.Item>
        <Form.Item label="Barcode Size:">
          <select
            className="form-control"
            id="size"
            value={size}
            onChange={handleChangeSize}
          >
            <option value="150">Default</option>
            <option value="50">Small</option>
            <option value="100">Medium</option>
            <option value="200">Large</option>
          </select>
        </Form.Item>
        {load.brands && load.brands.length > 0 && (
          <Form.Item label="Select Brand:">
            <select
              className="form-control"
              id="brand"
              value={brand ? brand.brandName : ""}
              onChange={handleChangeBrand}
            >
              {load.brands.map((item, key) => (
                <option key={key} value={item.brandName}>
                  {item.brandName}
                </option>
              ))}
            </select>
          </Form.Item>
        )}
        <Form.Item label="Print Vertically:">
          <Checkbox checked={printVertically} onChange={handleCheckboxChange} />
        </Form.Item>
      </Form>
      <div id="printable-barcodes" style={{ display: "none" }}>
        <div className="barcode-row">
          {[...Array(count)].map((_, i) => (
            <div key={i} className="barcode-item" style={{ width: size + "px", height: "auto" }}>
              <img
                src={brand ? brand.barcodeImage : load.barcodeImage}
                alt={`Barcode for ${
                  brand ? brand.brandName : `Load ${load.loadNumber}`
                }`}
                style={{ width: size + "px", height: "auto" }}
              />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

GenerateBarcodePopUp.propTypes = {
  load: PropTypes.shape({
    brands: PropTypes.arrayOf(
      PropTypes.shape({
        brandName: PropTypes.string.isRequired,
        barcodeImage: PropTypes.string.isRequired,
      })
    ),
    loadNumber: PropTypes.string.isRequired,
    barcodeImage: PropTypes.string.isRequired,
  }),
  onClose: PropTypes.func.isRequired,
};

export default GenerateBarcodePopUp;
