import React, { useState } from "react";
import { useNavigate } from "react-router";
// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";
import AddCustomers from "./addCustomers";
import CustomerList from "./customerList";
import '../styles.css';
 
export default function Customers() {
 
 const [tab, setTab] = useState('Add');
 
function handleClick(value){
 setTab(value);
}
 
 // This following section will display the form that takes the input from the user.
 return (
   <div>
    <div className="customer-nav-bar">
    <nav className="navbar-light bg-light navbar-2">  
        <ul className="navbar-nav ml-auto navbar-ul-2">
            <li className={"nav-link "+ (tab === 'Add' ? "active": undefined)} onClick={()=>handleClick('Add')}>Add/Edit </li>
            <li className={"nav-link "+ (tab === 'List' ? "active": undefined)}  onClick={()=>handleClick('List')}>Customer List </li>
          </ul>
        </nav>
    </div>
    {tab === 'Add' ? <AddCustomers/> :null}
    {tab === 'List' ? <CustomerList/> :null}
   </div>
 );
}