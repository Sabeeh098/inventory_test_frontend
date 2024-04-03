import React from 'react';
import Table from 'react-bootstrap/Table';
import { EyeIcon } from '../../EntryFile/imagePath';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import PropTypes from 'prop-types'; 

const ProductTable = ({ data }) => {
  const totalLoadCost = data.reduce((total, item) => total + item.loadCost, 0);
  // const totalPerPalletCost = data.reduce((total, item) => total + item.perPalletCost, 0)
  console.log(data,"Dataas");
  return (
    <div className='purchaseTable'>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th style={{backgroundColor: '#6A5ACD', color: 'white'}}>Load Number</th>
            <th style={{backgroundColor: '#6A5ACD', color: 'white'}}>Total Pallets</th>
            <th style={{backgroundColor: '#6A5ACD', color: 'white'}}>Per Pallets Cost($)</th>
            <th style={{backgroundColor: '#6A5ACD', color: 'white'}}>Load Cost($)</th>
            <th style={{backgroundColor: '#6A5ACD', color: 'white'}}>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{item.loadNumber}</td>
              <td>{item.palletsCount}</td>
              <td>{item.perPalletCost}</td>
              <td>{item.loadCost}</td>
              <td>
              <Link
  className="me-3"
  to={{
    pathname: "/dream-pos/product/reportDetail",
    state: { report: item } // Pass the report data as state
  }}
>
  <img src={EyeIcon} alt="img" />
</Link>
              </td>
            </tr>
          ))}
          {/* Example of calculating grand total */}
          <tr>
          {/* <p style={{ marginRight: '10px' }} className="loadCost"> <span style={{ display: 'inline-block', border: '1px solid #ccc', padding: '4px', borderRadius: '5px', backgroundColor: '#f0f0f0' }}>${totalPerPalletCost}</span></p> */}
            <td><p className="pallet">Grand Total: <span style={{ display: 'inline-block', border: '1px solid #ccc', padding: '4px', borderRadius: '5px', backgroundColor: '#f0f0f0' }}></span></p></td>
            <td></td>
            <td></td>
            <td><p className="pallet"><span style={{ display: 'inline-block', border: '1px solid #ccc', padding: '4px', borderRadius: '5px', backgroundColor: '#f0f0f0' }}>${totalLoadCost}</span></p></td>
            <td></td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

ProductTable.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    loadNumber: PropTypes.string.isRequired,
    totalPallets: PropTypes.number.isRequired,
    loadCost: PropTypes.number.isRequired,
    perPalletCost: PropTypes.number.isRequired
  })).isRequired
};


export default ProductTable;
