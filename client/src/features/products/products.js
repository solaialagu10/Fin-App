import React, { useState } from "react";
import '../../common/styles.css';
import ProductList from "./productList";
import AddProducts from "./addProducts";
import EditProducts from "./editProducts";

 
export default function Products() {

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
            <li className={"nav-link "+ (tab === 'Add' || tab === 'Edit' ? "active": undefined)} onClick={()=>handleClick('Add')}>Add/Edit </li>
            <li className={"nav-link "+ (tab === 'List' ? "active": undefined)}  onClick={()=>handleClick('List')}>Products List </li>
          </ul>
        </nav>
    </div>   
    {tab === 'Add' ? <AddProducts row={row}/> :null}
    {tab === 'List' ? <ProductList changeTab={handleClick}/> :null} 
    {tab === 'Edit' ? <EditProducts row={row} changeTab={handleClick}/> :null}
   </div>
 );
}