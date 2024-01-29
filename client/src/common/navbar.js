import React from "react";
import './navbar.css';
// We import bootstrap to make our application look better.
import "bootstrap/dist/css/bootstrap.css";


 
// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";
 
// Here, we display our Navbar
export default function Navbar() {
 return (     
  
     <nav className="navbar navbar-expand-lg navbar-expand-md navbar-light bg-light" >     
      <div className="container">
             <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
               data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
               <span class="my-1 mx-2 close">X</span>
              <span className="navbar-dark navbar-toggler-icon custom-toggler"></span>
             </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
         <ul className="nav navbar-nav ml-auto navbar-1">
           <li className="nav-item">
             <NavLink className="nav-link" to="/dashboard" >
             <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse">
               Dashboard
               </span>
             </NavLink>
            </li>
            <li className="nav-item "> 
             <NavLink className="nav-link " to="/customers">
             <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse">
               Customers
               </span>
             </NavLink>
            </li>
            <li className="nav-item"> 
             <NavLink className="nav-link" to="/invoices">
             <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse">
               Invoices
               </span>
             </NavLink>
            </li>            
            <li className="nav-item"> 
             <NavLink className="nav-link" to="/products">
             <span data-bs-toggle="collapse" data-bs-target=".navbar-collapse">
               Products
               </span>
             </NavLink>
            </li>           
         </ul>
       </div>
       </div>
     </nav>
    
 );
}