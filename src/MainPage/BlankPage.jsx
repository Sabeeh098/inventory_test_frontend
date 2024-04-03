import React, { useState } from "react";
import { Button, Modal } from "antd";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import moment from "moment";
import PropTypes from "prop-types";

const GenerateBarcodePopUp = ({ load, onClose }) => {
  const [count, setCount] = useState(1);
  const [size, setSize] = useState("default");

  const handleChangeCount = (e) => setCount(parseInt(e.target.value, 10) || 1);
  const handleChangeSize = (e) => setSize(e.target.value);

  const handlePrint = async () => {
    try {
      const barcodesContainer = document.getElementById("barcodes");
      const canvas = await html2canvas(barcodesContainer);

      const pdf = new jsPDF();
      const imgData = canvas.toDataURL("image/png");

      // Add image to PDF
      pdf.addImage(imgData, "PNG", 10, 10);

      // Save PDF
      const filename = `${moment().format("L")}_Barcodes.pdf`;
      pdf.save(filename);

      onClose();
    } catch (error) {
      console.error("Error printing barcodes:", error);
    }
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
      <form>
        <div className="mb-3">
          <label htmlFor="count" className="form-label me-3">
            Number of Barcodes:
          </label>
          <input
            type="number"
            min={1}
            className="form-control"
            id="count"
            value={count}
            onChange={handleChangeCount}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="size" className="form-label me-3">
            Barcode Size:
          </label>
          <select
            className="form-control"
            id="size"
            value={size}
            onChange={handleChangeSize}
          >
            <option value="default">Default</option>
            <option value="2">Small</option>
            <option value="4">Medium</option>
            <option value="6">Large</option>
            {/* Add additional size options here if needed */}
          </select>
        </div>
      </form>
      <div
        id="barcodes"
        className="d-flex flex-wrap justify-content-center m-1"
      >
        {[...Array(count)].map((_, index) => (
          <div className="m-1" key={index}>
            {/* Display the base64-encoded barcode image for the specific load */}
            {load.barcodeImage && (
              <img
                src={load.barcodeImage}
                alt={`Barcode for Load ${load.loadNumber}`}
                style={{ width: `${size}cm`, height: "auto" }}
              />
            )}
            {load.brands.map((item, key) => (
              <img
                key={key}
                src={item.barcodeImage}
                alt={`Barcode for Load ${item.loadNumber}`}
                style={{ width: `${size}cm`, height: "auto" }}
              />
            ))}
          </div>
        ))}
      </div>
    </Modal>
  );
};

GenerateBarcodePopUp.propTypes = {
  load: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default GenerateBarcodePopUp;