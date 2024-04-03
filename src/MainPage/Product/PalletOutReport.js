import React from 'react';
import Table from 'react-bootstrap/Table';
import PropTypes from 'prop-types';


const PalletOutReport = ({ data }) => {
  // const totalPalletsOut = data.reduce((total, item) => total + item.palletsOut, 0);
  const loadCostTotal = data.reduce((total, item) => total + item.total, 0);

  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1; // Adding 1 because getMonth() returns zero-based month
    const day = date.getDate();
    return `${month}/${day}`;
  };
  return (
    <>
      <div className='purchaseTable'>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th style={{backgroundColor: '#6A5ACD', color: 'white'}}>Procces Date</th>
              <th style={{backgroundColor: '#6A5ACD', color: 'white'}}>Load Number</th>
              <th style={{backgroundColor: '#6A5ACD', color: 'white'}}>Pallets Out</th>
              {/* <th style={{backgroundColor: '#6A5ACD', color: 'white'}}>Per Pallets Cost($)</th> */}
              <th style={{backgroundColor: '#6A5ACD', color: 'white'}}>Pallet Out Cost ($)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
               <td>{formatDate(item.addedAt)}</td>
                <td>{item.loadNumber}</td>
                <td>{item.palletsCount}</td>
            
                {/* <td>{item.perPalletCost}</td> */}
                <td>{item.total}</td>
              </tr>
            ))}
            <tr>
              <td><p className="pallet">Grand Total: <span style={{ display: 'inline-block', border: '1px solid #ccc', padding: '4px', borderRadius: '5px', backgroundColor: '#f0f0f0' }}></span></p></td>
              
              <td></td>
              <td></td>
              {/* <p className="pallet"> <span style={{ display: 'inline-block', border: '1px solid #ccc', padding: '4px', borderRadius: '5px', backgroundColor: '#f0f0f0' }}>{totalPalletsOut}</span></p> */}
              {/* <td></td> */}
             
              <td> <p style={{ marginRight: '10px' }} className="loadCost"> <span style={{ display: 'inline-block', border: '1px solid #ccc', padding: '4px', borderRadius: '5px', backgroundColor: '#f0f0f0' }}>${loadCostTotal}</span></p></td>
            </tr>
          </tbody>
        </Table>
      </div>
    </>
  );
};

PalletOutReport.propTypes = {
    data: PropTypes.array.isRequired,
  };
  

export default PalletOutReport;
