import React, { useState } from "react";
import { useNavigate } from "react-router";
import ProductList from "./productList";
import '../styles.css';


 
export default function Products() {
  const [data,setData] =  useState([
  {
      "First Name": "horn-od926",
      "Last Name": "selection-gsykp",
      "Age": 22,
      "Visits": 20,
      "Progress": 39
  },
  {
      "First Name": "heart-nff6w",
      "Last Name": "information-nyp92",
      "Age": 16,
      "Visits": 98,
      "Progress": 40
  },
  {
      "First Name": "minute-yri12",
      "Last Name": "fairies-iutct",
      "Age": 7,
      "Visits": 77,
      "Progress": 39
  },
  {
      "First Name": "degree-jx4h0",
      "Last Name": "man-u2y40",
      "Age": 27,
      "Visits": 54,
      "Progress": 92
  }
]);
  const [dataTable,setDataTable] = useState([
  {
      "Name": "horn-od926",
      "Position": "selection-gsykp",
      "Office":"XDH",
      "Age": 22,
      "Start Date": "24-Jan-2020",
      "Salary": 39
  },
  {
      "Name": "heart-nff6w",
      "Position": "information-nyp92",
      "Office":"XDH",
      "Age": 16,
      "Start Date": "12-Mar-2022",
      "Salary": 40
  },
  {
      "Name": "minute-yri12",
      "Position": "fairies-iutct",
      "Office":"XDH",
      "Age": 7,
      "Start Date": "05-Dec-2021",
      "Salary": 39
  },
  {
      "Name": "degree-jx4h0",
      "Position": "man-u2y40",
      "Office":"XDH",
      "Age": 27,
      "Start Date": "15-Aug-2022",
      "Salary": 92
  }
]);
 const [form, setForm] = useState({
   productName: "",
   productId: "",
   price: ""   
 });
 const navigate = useNavigate();
 
 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 } 
 
 // This function will handle the submission.
 async function onSubmit(e) {
   e.preventDefault();
 
   // When a post request is sent to the create url, we'll add a new record to the database.
   const newPerson = { ...form };
 
   await fetch("http://localhost:5000/add_customer", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newPerson),
   })
   .catch(error => {
     window.alert(error);
     return;
   });
 
   setForm({ name: "", position: "", level: "" });
   navigate("/home");
 }
 
 // This following section will display the form that takes the input from the user.
 return (
   <div>
     <h3>Add Products</h3>
     <form onSubmit={onSubmit}>
      <div className="product-group col-md-12">
       <div className="form-group col-md-4">
         <label htmlFor="productName">Name</label>
         <input
           type="text"
           className="form-control"
           id="productName"
           value={form.productName}
           onChange={(e) => updateForm({ productName: e.target.value })}
           placeholder="Enter Product Name"
         />
       </div>
       <div className="form-group col-md-4">
         <label htmlFor="productId">Id</label>
         <input
           type="text"
           className="form-control"
           id="productId"
           value={form.productId}
           onChange={(e) => updateForm({ productId: e.target.value })}
           placeholder="Enter Product Id"
         />
       </div>    
       <div className="form-group col-md-4">
         <label htmlFor="price">Price</label>
         <input
           type="text"
           className="form-control"
           id="price"
           value={form.price}
           onChange={(e) => updateForm({ price: e.target.value })}
           placeholder="Enter Product Price"
         />
       </div>   
       </div>
       <div className="product-group-buttons ">    
       <div className="form-group  pull-right">
         <input
           type="submit"
           value="Save"
           className="btn btn-primary"
         />
       </div>
       <div className="form-group  pull-right">
         <input
           type="submit"
           value="Cancel"
           className="btn btn-primary"
         />
       </div>
       </div>      
     </form>
     <ProductList data={dataTable}/>
   </div>
 );
}