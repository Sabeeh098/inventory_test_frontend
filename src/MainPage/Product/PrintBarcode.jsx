/* eslint-disable no-dupe-keys */
/* eslint-disable no-undef */
import React, { useState, useEffect } from "react";
import { Scanner } from "../../EntryFile/imagePath";
import Table from "../../EntryFile/datatables";
import { Link } from "react-router-dom";
import { DeleteIcon } from "../../EntryFile/imagePath";
import Select2 from "react-select2-wrapper";
import "react-select2-wrapper/css/select2.css";
import { adminApiInstance } from "../../api/axios";

const options = [
  { id: 1, text: "36mm (1.4inch)" },
  { id: 2, text: "12mm (1inch)" },
];

const PrintBarcode = () => {
  const [pallets, setPallets] = useState([]);
  
  // const [selectedProductName, setSelectedProductName] = useState('');

  useEffect(() => {
    fetchPalletDetails();
  }, []);

  const fetchPalletDetails = async () => {
    try {
      const response = await adminApiInstance.get('/getPalletes');
      setPallets(response.data);
    } catch (error) {
      console.error('Error fetching pallet details:', error);
    }
  };

  const deleteRow = (id) => {
    console.log(`Delete row with ID: ${id}`);
  };

  const printBarcode = async (palletId) => {
    try {
      setLoading(true);
      const response = await adminApiInstance.get(`/print/${palletId}`);
      if (response.status !== 200) {
        throw new Error('Failed to print barcode');
      }
  
      const { barcodeSvg } = await response.data;
  
      const printWindow = window.open('', '_blank');
      printWindow.document.write('<html><head><title>Barcode Print</title></head><body>');
      printWindow.document.write(`<img id="barcodeImage" src="data:image/svg+xml;base64,${barcodeSvg}" />`);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
  
      // Wait for a short delay to ensure the image is fully loaded
      setTimeout(() => {
        // Trigger the browser's print dialog
        printWindow.print();
      }, 1000); // Adjust the delay as needed
    } catch (error) {
      console.error('Error printing barcode:', error);
    } finally {
      setLoading(false);
    }
  };
  
  

  const columns = [
    {
      title: "Pallet Name",
      dataIndex: "palletName",
    },
    {
      title: "SKU",
      dataIndex: "sku",
    },
    {
      title: "Pallet imge",
      dataIndex: "barcodeSvg",
    },
    {
      title: "Pallet Amount",
      dataIndex: "palletAmount",
    },
    {
      render: (text, record) => (
        <div className="text-end">
          <Link to="#" onClick={() => deleteRow(record._id)}>
            <img src={DeleteIcon} alt="img" />
          </Link>
          <button className="btn btn-print" onClick={() => printBarcode(record._id)}>
            Print Barcode
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="page-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="page-title">
              <h4>Print Barcode</h4>
              <h6>Print pallet barcodes</h6>
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <div className="requiredfield">
                <h4>
                  The field labels marked with * are required input fields.
                </h4>
              </div>
              <div className="form-group">
                <label>Pallet Name</label>
                <div className="input-groupicon">
                  <Select2
                    className="select"
                    data={pallets.map((pallet) => ({ id: pallet._id, text: pallet.palletName }))}
                    options={{
                      placeholder: "Select Pallet",
                      onSelect: (event) => setSelectedProductName(event.currentTarget.value),
                    }}
                  />
                  <div className="addonset">
                    <img src={Scanner} alt="img" />
                  </div>
                </div>
              </div>
              <div className="table-responsive table-height">
                <Table columns={columns} dataSource={pallets} />
              </div>
              <div className="row">
                <div className="col-lg-3 col-sm-6 col-12">
                  <div className="form-group">
                    <label>Paper Size</label>
                    <Select2
                      className="select"
                      data={options}
                      options={{
                        placeholder: "36mm (1.4inch)",
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <button className="btn btn-submit me-2">Submit</button>
                  <button className="btn btn-cancel">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrintBarcode;
