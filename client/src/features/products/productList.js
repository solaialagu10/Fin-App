import React, { useState } from "react";
import ReactBSTables from '../../common/tableBootstrap';
import  useContextData  from "../../context/Mycontext";
import moment from "moment";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ProductList(props){
  const [loading,setLoading] = useState(false);
  const {products, updateProducts} = useContextData(); 
   const columns=[{
    "dataField": "productName",
    "text": "Product Name",
    "sort": true
},{
  "dataField": "productId",
  "text": "Product Id",
  "sort": true
},{
  "dataField": "price",
  "text": "Price",
  "sort": true
},{
  "dataField": "createdDate",
  "text": "Created Date",
  "sort": true,
  formatter: dateFormatter
},{
  "dataField": "modifiedDate",
  "text": "Modified Date",
  "sort": true,
  formatter: dateFormatter
    }]
  function dateFormatter(cell, row) {
    return (
    <span>{moment(cell).format("LLL")}</span>
  );
}


// This method will delete a record
async function deleteRecord(selected) {
    try{
      setLoading(true);
      const response = await toast.promise(axios.post("delete", selected), {
        pending: "Deleting product(s)",
        success: "Product(s) deleted successfully !",
        error: "Error in deleting product(s), please try again later !"
      }); 
      updateProducts(response.data);
  }
    catch (err) {
        console.log("error"+err);
    }finally{
      setLoading(false);
    }
}

  function editRecord(selectedRow){
   props.changeTab('Edit',selectedRow);
  }

  return (
    <div>   
      {loading && (<div className="overlay">
                  <div className="overlay__wrapper">
                    <div className="spinner-grow text-primary overlay__spinner" 
              id="spinner"role="status">
            <span className="sr-only"></span>
        </div></div></div>)}
      <ToastContainer />
      <ReactBSTables data={products} columns={columns} deleteRecord={deleteRecord} editRecord={editRecord} keyField="productName"/>
    </div>
  );
}
 
