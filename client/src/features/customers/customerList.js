import React, { useState, useEffect } from "react";
import ReactBSTables from '../../common/tableBootstrap';
import moment from "moment";
import axios, { AxiosError } from "axios";
import useContextData  from "../../context/Mycontext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function CustomerList(props){
  const [loading,setLoading] = useState(false);
  const {customers,updateCustomers} =useContextData();
   function dateFormatter(cell, row) {
    return (
    <span>{moment(cell).format("LLL")}</span>
  );  
  }
  const [paidlist, setPaidlist] = useState([]);
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
  align: 'center',
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
  const cancelToken = axios.CancelToken.source();
  async function getPaidList() {
      setLoading(true);     
      await axios.get("paidList",{
        cancelToken : cancelToken.token
      }).then((res)=>{
        setPaidlist(res.data);
      }).catch((err)=>{
        if(axios.isCancel(err)){
          console.log("cancelled");
        } else {
          console.log("error"+err);
          toast.error('Service is down, please try again later !') 
        }
      }).finally(() =>{
        setLoading(false);
      })
  }  
  getPaidList();
  return()=>{
    cancelToken.cancel();
  }
}, []);

// This method will delete a record
async function deleteRecord(selected) {
    try{
         setLoading(true);
        const response = await toast.promise(axios.post("deleteCustomer", selected), {
          pending: "Deleting customer(s)",
          success: "Customer(s) deleted successfully !",
          error: "Error in deleting customer(s), please try again later !"
        }); 
        updateCustomers(response.data);
    }
    catch(e){
      console.log("error"+e);
    } finally{
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
      <ReactBSTables data={customers} columns={columns} deleteRecord={deleteRecord} editRecord={editRecord} paidList={paidlist} keyField="customerName"/>      
    </div>
  );
}
 
