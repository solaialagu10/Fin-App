import React from "react";
import './navbar.css';
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";
 
// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";
 
// Here, we display our Navbar
export default function Navbar() {
 return (
   <div>     
     <nav className="navigation navbar navbar-expand-lg navbar-light bg-light">       
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
         <ul className="navbar-nav ml-auto navbar-1">
           <li className="nav-item">
             <NavLink className="nav-link" to="/dashboard">
               Dashboard
             </NavLink>
            </li>
            <li className="nav-item"> 
             <NavLink className="nav-link" to="/customers">
               Customers
             </NavLink>
            </li>
            <li className="nav-item"> 
             <NavLink className="nav-link" to="/invoices">
               Invoices
             </NavLink>
            </li>
            <li className="nav-item"> 
             <NavLink className="nav-link" to="/reports">
               Reports
             </NavLink>
            </li>
            <li className="nav-item"> 
             <NavLink className="nav-link" to="/products">
               Products
             </NavLink>
            </li>           
         </ul>
       </div>
     </nav>
   </div>
 );
}