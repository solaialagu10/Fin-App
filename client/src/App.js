import React from "react";
import './App.css';
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
 
// We import all the components we need in our app

import Customers from "./components/Customers/customers";
import AddCustomers from "./components/Customers/addCustomers";
import CustomerList from "./components/Customers/customerList";
import Products from "./components/Products/products";
import Invoices from "./components/Invoices/invoices";
import Reports from "./components/Reports/reports";
import Dashboard from "./components/Dashboard/dashboard";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Layout from "./pages/layout"
const App = () => {
 return (

  <div>
        <Routes>
          <Route  element={<Layout />}>
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customerList" element={<CustomerList />} />
            <Route path="/addCustomers" element={<AddCustomers />} />
          </Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
     </div>

 );
};
 
export default App;