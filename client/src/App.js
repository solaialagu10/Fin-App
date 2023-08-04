import React from "react";
import './App.css';
// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
import { RequireAuth } from "react-auth-kit";
// We import all the components we need in our app
import Customers from "./features/customers/customers";
import AddCustomers from "./features/customers/addCustomers";
import CustomerList from "./features/customers/customerList";
import Products from "./features/products/products";
import Home from "./features/invoice/home";
import Dashboard from "./features/dashboard/dashboard";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Layout from "./pages/layout";
const App = () => {
 return (

  <div>
        <Routes>
          <Route path="/" element={<RequireAuth loginPath={'/login'}>
            <Layout />
          </RequireAuth>}>
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route path="/invoices" element={<Home />} />
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