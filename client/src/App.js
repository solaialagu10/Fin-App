import React from "react";
import './App.css';
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app
import Navbar from "./components/navbar";
import Customers from "./components/Customers/customers";
import AddCustomers from "./components/Customers/addCustomers";
import CustomerList from "./components/Customers/customerList";
import Products from "./components/Products/products";
import Invoices from "./components/Invoices/invoices";
import Reports from "./components/Reports/reports";
import Dashboard from "./components/Dashboard/dashboard";
 
const App = () => {
 return (

  <div>
    <div className="app-header">
      <div className="header-text">Billing App</div>
    </div>
   <div className="app-container">
    <div className="div-left">
     <Navbar />
     </div>
     <div className="div-right">
     <Routes>
       <Route exact path="/dashboard" element={<Dashboard />} />
       <Route path="/reports" element={<Reports />} />
       <Route path="/invoices" element={<Invoices />} />
       <Route path="/customers" element={<Customers />} />
       <Route path="/products" element={<Products />} />
       <Route path="/customerList" element={<CustomerList />} />
       <Route path="/addCustomers" element={<AddCustomers />} />
     </Routes>
     </div>
   </div>
   </div>
 );
};
 
export default App;