/* eslint-disable react/prop-types */
import React from 'react'
import { Redirect, Route ,Switch} from 'react-router-dom';
import ProductList from './ProductList'
import AddProduct from './AddProduct'
import EditProduct from './EditProduct'
import CategoryList from './CategoryList';
import AddCategory from './AddCategory';
import EditCategory from './EditCategory';
import SubCategoryTable from './SubCategoryTable';
import AddSubCategory from './AddSubCategory';
import EditSubCategory from './EditSubCategory';
import BrandList from './BrandList';

import EditBrand from './EditBrand';
import ImportProduct from './ImportProduct';
import PrintBarcode from './PrintBarcode';
import ProductDetails from './productDetails';
import AddEmployee from './AddEmployee';
import UserList from './UserList';
// import Purchaseorder from './purchaseorder';
import ScanInScanOut from './ScanInScanOut';
import Inventory from './Inventory';
import LoadReport from './LoadReport';
import addCat from './addCat';
import PurchaseOrder1 from './PurchaseOrder1';
import PurchaseOrder from './PurchaseOrder';

const ProductRoute = ({ match }) => (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/productlist-product`} />
        <Route path={`${match.url}/add-loads`} component={AddProduct} />
        <Route path={`${match.url}/list-loads`} component={ProductList} />
        <Route path={`${match.url}/add-pallets`} component={AddCategory} />
        <Route path={`${match.url}/printbarcode-pallets`} component={PrintBarcode} />
        <Route path={`${match.url}/add-User`} component={AddEmployee} />
        <Route path={`${match.url}/Users-List`} component={UserList} />
        <Route path={`${match.url}/addCategory`} component={addCat} />
        <Route path= {`${match.url}/reportDetail`} component={PurchaseOrder}/>

        <Route path={`${match.url}/purchaseorderreport`} component={PurchaseOrder1} />
        <Route path={`${match.url}/Load-Report`} component={LoadReport} />
        <Route path={`${match.url}/ScanInScanOut`} component={ScanInScanOut} />
        <Route path={`${match.url}/InventoryIndicators`} component={Inventory} />




        <Route path={`${match.url}/editproduct-product`} component={EditProduct} />
        <Route path={`${match.url}/categorylist-product`} component={CategoryList} />
        <Route path={`${match.url}/editcategory-product`} component={EditCategory} />
        <Route path={`${match.url}/subcategorytable-product`} component={SubCategoryTable} />
        <Route path={`${match.url}/addsubcategory-product`} component={AddSubCategory} />
        <Route path={`${match.url}/editsubcategory-product`} component={EditSubCategory} />
        <Route path={`${match.url}/brandlist-product`} component={BrandList} />
        <Route path={`${match.url}/editbrand-product`} component={EditBrand} />
        <Route path={`${match.url}/importproduct-product`} component={ImportProduct} />
        <Route path={`${match.url}/product-details/:id`} component={ProductDetails} />

    </Switch>
)

export default ProductRoute;