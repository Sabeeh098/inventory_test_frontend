import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Form, Input, Modal } from "antd";

const BulkBarcode = ({ barcodeImage, onClose }) => { 
  const [count, setCount] = useState(1);
  const [size, setSize] = useState(150);

  const handleChangeCount = (e) => setCount(parseInt(e.target.value, 10) || 1);
  const handleChangeSize = (e) => setSize(e.target.value);

  // Function to print barcode images
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
              flex-wrap: wrap;
              justify-content: center;
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

  return (
    <Modal
      visible={true} // Pass visible prop
      title={`Print Barcode`}
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
      </Form>
      <div id="printable-barcodes" style={{ display: "none" }}>
        <div className="barcode-row">
          {[...Array(count)].map((_, i) => (
            <div key={i} className="barcode-item" style={{ width: size + "px", height: "auto" }}>
              <img
                src={barcodeImage}
                alt={`Barcode ${i + 1}`}
                style={{ width: size + "px", height: "auto" }}
              />
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};

BulkBarcode.propTypes = {
  barcodeImage: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired, // Add visible prop type
};

export default BulkBarcode;
