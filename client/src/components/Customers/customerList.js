import React, { useState, useEffect } from "react";
import ReactBSTables from '../tableBootstrap';
import moment from "moment";

export default function CustomerList(props){
  
   function dateFormatter(cell, row) {
    return (
    <span>{moment(cell).format("LLL")}</span>
  );  
  }
  const [customers, setCustomers] = useState([]);
  const [paidlist, setPaidlist] = useState([]);
  const [deleteFlag, setDeleteFlag] = useState(false);
  const [deletemessage, setDeletemessage] = useState(false);
  let [columns,setColumns]=useState([{
    "dataField": "customerName",
    "text": "Name",
    "sort": true
},{
  "dataField": "mobileNo",
  "text": "Mobile No",
  "sort": true,
  "editable":false
},{
  "dataField": "totalBalance",
  "text": "Balance",
  "sort": true,
  style: {
    width: '6em',
  },
  "editable":false
},{
  "dataField": "amountPaid",
  "text": "Amount Paid",
  "sort": true,
  editCellClasses:'edit-class',
  editCellStyle: {
    fontSize: '10px'
  },
  validator: (newValue, row, column) => {
    if (isNaN(newValue) || newValue < 0) {
      return {
        valid: false,
        message: 'Invalid no'
      };
    } 
    return true;
  }
},{
  "dataField": "email",
  "text": "Email Id",
  "sort": true,
  "editable":false,
  classes: (cell, row, rowIndex, colIndex) => {
    return 'custom-word';
  }
},{
  "dataField": "modifiedDate",
  "text": "Modified Date",
  "sort": true,
  "editable":false,
  formatter: dateFormatter
}])

 // This method fetches the records from the database.
 useEffect(() => {
  async function getCustomers() {
    const response = await fetch(`http://localhost:5000/customers/`);
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const customers = await response.json();    
    setCustomers(customers);
  }  
  getCustomers();
  return;
}, [deleteFlag]);

useEffect(() => {
  async function getPaidList() {
    const response = await fetch(`http://localhost:5000/paidList/`);
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const paidList = await response.json();    
    setPaidlist(paidList);
  }  
  getPaidList();
  return;
}, []);

// This method will delete a record
async function deleteRecord(selected) {
  setDeletemessage(false);
  await fetch(`http://localhost:5000/deleteCustomer`, {
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
      {deletemessage === true && <div className="text-success">Customer(s) deleted successfully.</div>}     
      <ReactBSTables data={customers} columns={columns} deleteRecord={deleteRecord} editRecord={editRecord} paidList={paidlist} keyField="customerName"/>
      <div className="text-info info-class">* Double click on amount paid column to enter the value</div>
    </div>
  );
}
 
