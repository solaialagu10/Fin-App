import React, { useState } from "react";
import '../styles.css';
import ProductList from "./productList";
import AddProducts from "./addProducts";

 
export default function Products() {

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
            <li className={"nav-link "+ (tab === 'List' ? "active": undefined)}  onClick={()=>handleClick('List')}>Products List </li>
          </ul>
        </nav>
    </div>   
    {tab === 'Add' ? <AddProducts tab={tab}/> :null}
    {tab === 'List' ? <ProductList/> :null} 
   </div>
 );
}