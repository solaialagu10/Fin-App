import React, { useState, useEffect } from "react";
import ReactBSTables from '../tableBootstrap';
import moment from "moment";
import axios, { AxiosError } from "axios";
import { useContextData } from "../../context/Mycontext";

export default function CustomerList(props){
  const {customers,updateCustomers} =useContextData();
   function dateFormatter(cell, row) {
    return (
    <span>{moment(cell).format("LLL")}</span>
  );  
  }
  const [paidlist, setPaidlist] = useState([]);
  const [deletemessage, setDeletemessage] = useState(false);
  let [columns,setColumns]=useState([{
    "dataField": "customerName",
    "text": "Name",
    "sort": true
},{
  "dataField": "mobileNo",
  "text": "Mobile No",
  "sort": true,
  "editable":false,
  align: 'center',
  formatter : (cell, row) =>{
      if(cell === 0 || cell === null) {return '-';}
      return cell;
  }
},{
  "dataField": "totalBalance",
  "text": "Balance",
  "sort": true,
  align: 'center',
  style: {
    width: '6em',
  },
  "editable":false
},{
  "dataField": "amountPaid",
  "text": "Amount Paid",
  "sort": true,
  classes: 'place-holder-class',
  editorStyle: {
    backgroundColor: '#20B2AA'
  },
  validator: (newValue, row, column) => {
    if (isNaN(newValue)) {
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

useEffect(() => {
  async function getPaidList() {
    try{
      // const obj = JSON.parse(Cookies.get("_auth_state"));        
      const response = await axios.get("paidList");
      setPaidlist(response.data);
     }
      catch (err) {
        if(err && err instanceof AxiosError)
          console.log("error"+err);
      }
  }  
  getPaidList();
  return;
}, []);

// This method will delete a record
async function deleteRecord(selected) {
  setDeletemessage(false);
  const response = await axios.post("deleteCustomer", selected); 
  setDeletemessage(true);
  updateCustomers(response.data);
}

function editRecord(selectedRow){
  props.changeTab('Edit',selectedRow);
 }


  return (
    <div>
      {deletemessage === true && <div className="text-success">Customer(s) deleted successfully.</div>}     
      <ReactBSTables data={customers} columns={columns} deleteRecord={deleteRecord} editRecord={editRecord} paidList={paidlist} keyField="customerName"/>      
    </div>
  );
}
 
