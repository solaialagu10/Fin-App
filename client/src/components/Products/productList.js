import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import ReactBSTables from '../tableBootstrap';

import moment from "moment";

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
    const response = await fetch(`http://localhost:5000/products/`);
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const records = await response.json();
    setRecords(records);
  }
  getRecords();
  return;
}, [deleteFlag]);

// This method will delete a record
async function deleteRecord(selected) {
  setDeletemessage(false);
  await fetch(`http://localhost:5000/delete`, {
    headers: {'Content-Type': 'application/json'},
    method: "POST",
    body: JSON.stringify({selected})
  }); 
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
 
