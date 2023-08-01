import React, { useState } from "react";
import ReactBSTables from '../../common/tableBootstrap';
import { useContextData } from "../../context/Mycontext";
import moment from "moment";
import axios from "axios";

export default function ProductList(props){
  const {products, updateProducts} = useContextData(); 
  const [error,setError] = useState(false);
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
  const [deletemessage, setDeletemessage] = useState(false);
  function dateFormatter(cell, row) {
    return (
    <span>{moment(cell).format("LLL")}</span>
  );
}


// This method will delete a record
async function deleteRecord(selected) {
    try{
      setDeletemessage(false);
      const response = await axios.post("delete", selected); 
      updateProducts(response.data);
      setDeletemessage(true);
  }
    catch (err) {
        console.log("error"+err);
        setError(true); 
    }
}

  function editRecord(selectedRow){
   props.changeTab('Edit',selectedRow);
  }

  return (
    <div>   
      <div className="text-danger">{error ? "Service is down, please try again later" : ""}</div>
      {deletemessage === true && <div className="text-success">Product deleted successfully.</div>}
      <ReactBSTables data={products} columns={columns} deleteRecord={deleteRecord} editRecord={editRecord} keyField="productName"/>
    </div>
  );
}
 
