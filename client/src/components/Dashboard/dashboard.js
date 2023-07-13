import React, { useState, useEffect } from "react";
import '../styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';

export default function Dashboard() { 
  const [customers, setCustomers] = useState([]);
  const [invoices, setInvoices] = useState([]);
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
    async function getInvoices() {
      const response = await fetch(`http://localhost:5000/get_invoices/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
      const invoices = await response.json();    
      setInvoices(invoices);
    }
    getCustomers();
    getInvoices();
    return;
  }, []);

  
 function recordList() {
  if(invoices && invoices.length > 0){
   return invoices.map((invoice,index) => {
     return (
      <tr>
        <td>{invoice._id}</td>
        <td>{invoice.billTotal}</td>  
        <td>{invoice.totalCost}</td>         
        <td>{invoice.totalBalance}</td>
        <td>{invoice.billTotal - invoice.totalCost}</td>
      </tr>
     );
   });
 }
 }
 return (
   <div>
      <div style={{ display: 'block', 
                  width: 1000, padding: 30 }}>
      <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Daily Sales Report</Accordion.Header>
        <Accordion.Body>
        <table className="table table-striped table-bordered " >
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Total Bill</th>
              <th>Total Cost</th>              
              <th>Total Balance</th>
              <th>Profit</th>
            </tr>
          </thead>
          <tbody>{recordList()}</tbody>
          </table> 
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>Accordion Item #2</Accordion.Header>
        <Accordion.Body>
         
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
    </div>
   </div>
 );
}