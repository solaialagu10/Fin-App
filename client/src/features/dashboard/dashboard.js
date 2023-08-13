import React, { useState, useEffect } from "react";
import '../../common/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
import { MdArrowUpward,MdArrowDownward} from "react-icons/md";
import axios from 'axios';
import DatePicker from "react-datepicker";
import { subMonths } from 'date-fns';
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Dashboard() { 
  const [invoices, setInvoices] = useState([]);
  const [sales, setSales] = useState([]);
  const [amount, setAmount] = useState(0);
  const [loading,setLoading] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [timeline, setTimeline, getTimeline] = useState('');
  useEffect(() => {
    async function getInvoices() {
      try {
        if(timeline === '') { setLoading(true);}
        const dateTimeInParts = startDate.toISOString().split( "T" ); 
        const inputJson = {"date":dateTimeInParts[0]};
        const response = await axios.get("get_invoices",{ params: inputJson });
        setInvoices(response.data);
      } catch (e) {  
        toast.error('Service is down, please try again later !');
        console.log("<><<>< error"+e);
      }finally{
        if(timeline === '') { setLoading(false);}
      }
    }
    getInvoices();
    return;
  }, [startDate]);

  function CustomInput(props) {
  return (
    <div className="input-group">
      <input
        type="text"
        className="form-control"
        onClick={props.onClick}
        value={props.value}
        onChange={props.onChange}
        readOnly
      />
      <div className="input-group-append">
        <span className="input-group-text" style={{height:"100%"}}  onClick={props.onClick}>
          <FaCalendarAlt />
        </span>
      </div>
    </div>
  );
}

  const handleDateChange= (date) => {
  //   console.log("<><><>date "+date.toLocaleDateString());
    const dateTimeInParts = date.toISOString().split( "T" ); 
    setStartDate(date);    
    if(timeline != '')
    {
      getList(timeline,dateTimeInParts[0]);
    }
  }

  const handleTimelineChange= (e) => {
    setTimeline(e.target.value);
    const dateTimeInParts = startDate.toISOString().split( "T" ); 
    getList(e.target.value,dateTimeInParts[0]);
  }

  async function getList(timeline,date){ 
    const inputJson = {"timeline":timeline,"date":date};
    
    try {
      setLoading(true);
      const response =  await axios.post("day_sales_report", inputJson);         
      const response1 =  await axios.post("winning_amount", inputJson);
      const amount = response1.data[0]?.winningAmount === undefined ?  0 : response1.data[0]?.winningAmount;
      setSales(response.data);   
      setAmount(amount);
      } catch (e) {        
        toast.error('Service is down, please try again later !');
        console.log("<><<>< error"+e);
    }finally{
      setLoading(false);
    }
  }
  
 function recordList() {
  if(invoices && invoices.length > 0){
   return invoices.map((invoice,index) => {
     return (
      <tr>
        <td>{invoice._id}</td>
        <td>{invoice.prevBalance}</td>
        <td>{invoice.billTotal}</td>  
        <td>{invoice.totalCost}</td>   
        <td>{invoice.winningAmount}</td>      
        <td>{invoice.prevBalance + invoice.billTotal - invoice.winningAmount}</td>        
        <td>
         {invoice.billTotal - invoice.totalCost}
         {invoice.billTotal - invoice.totalCost > 0 ?
        <MdArrowUpward style={{paddingBottom:'5px',color: "green",fontSize: '25px'}}/>
         : <MdArrowDownward style={{paddingBottom:'5px',color: "red",fontSize: '25px'}}/>}        
        </td>
      </tr>
     );
   });
  }
}
 
 function recordList1() {
  if(sales && sales.length > 0){
   return sales.map((sales,index) => {
     return (
      <tr>
        <td>{sales.productName}</td>
        <td>{sales.qty}</td>  
        <td>{sales.price}</td>         
        <td>{sales.qty * sales.price}</td>
      </tr>
     );
   });
 }
 }
 return (
   <div>
      <ToastContainer />
      <div style={{ display: 'block', 
                  width: 1000, padding: 30 }}>
        <div className="datepicker-wrapper">
              <label> Select Date:</label> 
                
                <DatePicker selected={startDate} 
                  minDate={subMonths(new Date(), 1)} dateFormat="dd/MM/yyyy"
                  maxDate={new Date()}  onChange={handleDateChange} 
                  todayButton="TODAY"
                  customInput={<CustomInput />}/>  
        </div>           
        {loading && (<div className="overlay">
                  <div className="overlay__wrapper">
                    <div className="spinner-grow text-primary overlay__spinner" 
              id="spinner"role="status">
            <span className="sr-only"></span>
        </div></div></div>)}
      <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Customer Report</Accordion.Header>
        <Accordion.Body>
        <table className="table table-bordered sales-report-table" >       
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Prev Balance</th>
              <th>Total Bill</th>
              <th>Total Cost</th>
              <th>W Amount</th>
              <th>Total Balance</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>{recordList()}
          <tr >
            <td style={{fontWeight:800}}>Totals</td>
            <td>
            {Object.values(invoices).map((item) =>         
            (item.prevBalance)).reduce((a, b) => a + b, 0)         
              }
            </td>
            <td>
            {Object.values(invoices).map((item) =>         
            (item.billTotal)).reduce((a, b) => a + b, 0)         
              }
            </td>
            <td>
            {Object.values(invoices).map((item) =>         
            (item.totalCost)).reduce((a, b) => a + b, 0)         
              }
            </td>
            <td>
            {Object.values(invoices).map((item) =>         
            (item.winningAmount)).reduce((a, b) => a + b, 0)         
              }            
            </td>
            <td>
            {Object.values(invoices).map((item) =>         
            (item.prevBalance + item.billTotal - item.winningAmount)).reduce((a, b) => a + b, 0)         
              }
            </td>
            <td >
            {Object.values(invoices).map((item) =>         
            (item.billTotal - item.totalCost)).reduce((a, b) => a + b, 0)         
              }
            </td>
          </tr>
          </tbody>
          </table> 
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Total Sales Report</Accordion.Header>
        <Accordion.Body>
       
       
        <div className="dashboard-select">
       
          <select
                className="form-select custom-select"
                  id="selectmethod"
                  defaultValue=""
                  name="timeline"   
                  onChange={(e)=>handleTimelineChange(e)}             
                >
                  <option value="" disabled>Select Timeline</option>
                  <option value="2 PM">2 PM</option>
                  <option value="3 PM">3 PM</option>
                  <option value="5 PM">5 PM</option>
            </select>
        
        </div>
        <div>
        Winning total : <span className="green-class"> {amount} </span>
        &nbsp;&nbsp;&nbsp;Final amount  :  <span className="red-class"> {(Object.values(sales).map((item) => 
                      item.qty * item.price).reduce((a, b) => a + b, 0)
            ) - amount}</span>
        </div>
        {sales.length > 0 ? <table className="table table-striped table-bordered day-report-table" >
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Quanity</th>
              <th>Price</th>              
              <th>Total</th>
            </tr>
          </thead>
          <tbody>{recordList1()}</tbody>
          </table> :""}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    </div>
   </div>
 );
}