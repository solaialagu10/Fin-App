import React, { useState } from "react";
import { useNavigate } from "react-router";
// We import NavLink to utilize the react router.
import { NavLink } from "react-router-dom";
import AddCustomers from "./addCustomers";
import CustomerList from "./customerList";
import EditCustomers from "./editCustomers";
import '../styles.css';
 
export default function Customers() {
 
 const [tab, setTab] = useState('Add');
 const [row, setRow] = useState([]);
 
function handleClick(value,row){
 setTab(value);
 setRow(row);

}
 
 // This following section will display the form that takes the input from the user.
 return (
   <div>
    <div className="customer-nav-bar">
    <nav className="navbar-light bg-light navbar-2">  
        <ul className="navbar-nav ml-auto navbar-ul-2">
            <li className={"nav-link "+ (tab === 'Add' || tab === 'Edit'  ? "active": undefined)} onClick={()=>handleClick('Add')}>Add/Edit </li>
            <li className={"nav-link "+ (tab === 'List' ? "active": undefined)}  onClick={()=>handleClick('List')}>Customer List </li>
          </ul>
        </nav>
    </div>
    {tab === 'Add' ? <AddCustomers  row={row}/> :null}
    {tab === 'List' ? <CustomerList changeTab={handleClick}/> :null}
    {tab === 'Edit' ? <EditCustomers row={row} changeTab={handleClick}/> :null}
   </div>
 );
}