import React, { useState } from "react";
import { useNavigate } from "react-router";
import '../styles.css';
 
export default function AddProducts() {

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
   const newProduct = { ...form };
 
   await fetch("http://localhost:5000/add_product", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newProduct),
   })
   .catch(error => {
     window.alert(error);
     return;
   });
 
   setForm({ productName: "", productId: "", price: "" });
  //  navigate("/dashb");
 }
 
 // This following section will display the form that takes the input from the user.
 return (
   <div>
     {/* <h3>Add Products</h3> */}
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
       <div className="form-group  pull-right delete-btn">
         <input
           type="submit"
           value="Save"
           className="btn btn-primary"
         />
       </div>
       <div className="form-group  pull-right cancel-btn">
         <input
           type="submit"
           value="Cancel"
           className="btn btn-primary"
         />
       </div>
       </div>      
     </form>
   </div>
 );
}