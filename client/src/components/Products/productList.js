import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import ReactBSTables from '../tableBootstrap';

import moment from "moment";
import axios from "axios";

export default function ProductList(props){
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
  const [records, setRecords] = useState([]);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [deletemessage, setDeletemessage] = useState(false);
  function dateFormatter(cell, row) {
    return (
    <span>{moment(cell).format("LLL")}</span>
  );
}
  // This method fetches the records from the database.
  useEffect(() => {
  async function getRecords() {
    const response = await axios.get("products");
    setRecords(response.data);
  }
  getRecords();
  return;
}, [deleteFlag]);

// This method will delete a record
async function deleteRecord(selected) {
  setDeletemessage(false);
  await axios.post("delete", selected); 
  setDeleteFlag(deleteFlag => !deleteFlag); 
  setDeletemessage(true);
}

  function editRecord(selectedRow){
   props.changeTab('Edit',selectedRow);
  }

  return (
    <div>   
      {deletemessage === true && <div className="text-success">Product deleted successfully.</div>}
      <ReactBSTables data={records} columns={columns} deleteRecord={deleteRecord} editRecord={editRecord} keyField="productName"/>
    </div>
  );
}
 
