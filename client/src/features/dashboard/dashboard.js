import React, { useState, useEffect } from "react";
import '../../common/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
import { MdOutlineArrowUpward ,MdArrowUpward,MdArrowDownward} from "react-icons/md";
import axios from 'axios';
export default function Dashboard() { 
  const [invoices, setInvoices] = useState([]);
  const [sales, setSales] = useState([]);
  const [error,setError] = useState(false);
  const [amount, setAmount] = useState(0);
  useEffect(() => {
    async function getInvoices() {
      try {
      const response = await axios.get("get_invoices");
      setInvoices(response.data);
      } catch (e) {  
        setError(true);
        console.log("<><<>< error"+e);
      }
    }
    getInvoices();
    return;
  }, []);

  async function getList(e){
    const inputJson = {"input":e.target.value};
    try {
      const response =  await axios.post("day_sales_report", inputJson);
      setSales(response.data);      
      const response1 =  await axios.post("winning_amount", inputJson);
      const amount = response1.data[0]?.winningAmount.length > 0 ? response1.data[0].winningAmount : 0;
      setAmount(amount);
      } catch (e) {        
        setError(true);
        console.log("<><<>< error"+e);
    }
  }
  
 function recordList() {
  if(invoices && invoices.length > 0){
   return invoices.map((invoice,index) => {
     return (
      <tr>
        <td>{invoice._id}</td>
        <td>{invoice.billTotal}</td>  
        <td>{invoice.totalCost}</td>         
        <td>{invoice.totalBalance}</td>
        <td>{invoice.winningAmount}</td>
        <td>
         {invoice.billTotal - invoice.totalCost > 0 ?
        <MdArrowUpward style={{paddingBottom:'5px',color: "green",fontSize: '25px'}}/>
         : <MdArrowDownward style={{paddingBottom:'5px',color: "red",fontSize: '25px'}}/>}
         {invoice.billTotal - invoice.totalCost}
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
      <div style={{ display: 'block', 
                  width: 1000, padding: 30 }}>
        <div className="text-danger">{error ? "Service is down, please try again later" : ""}
        </div>              
      <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Customer Report</Accordion.Header>
        <Accordion.Body>
        <table className="table table-bordered sales-report-table" >       
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Total Bill</th>
              <th>Total Cost</th>              
              <th>Total Balance</th>
              <th>W Amount</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>{recordList()}</tbody>
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
                  onChange={(e)=>getList(e)}             
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