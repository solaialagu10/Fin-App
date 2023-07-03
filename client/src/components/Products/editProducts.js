import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import '../styles.css';
 
export default function EditProducts(props) {
const { register, handleSubmit,formState: { errors,isSubmitting,isSubmitSuccessful },setError,reset,setValue } = useForm({})
 const [form, setForm] = useState({
   productName: "",
   productId: "",
   price: ""

 });
 const [records, setRecords] = useState([]);
 useEffect(() => {
  async function getRecords() {    
    const response = await fetch(`http://localhost:5000/products/`);
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const records = await response.json();
    setRecords(records);
  }
  
  async function setData() {
    console.log("<><< Edit page "+JSON.stringify(props.row[0]));
    setForm(props.row[0]);
  }
  setData();
  getRecords();
  return;
}, [props.row]);
useEffect(() => {
  // reset form with product data
  reset(form);
}, [form]);
 
 function formValidation(data){
  const pNameCount = records.filter(x => x.productName === data.productName).length;   
  if(pNameCount != 0) {
    setError("productName", {
      type: "manual",
      message: "Product Name is already existing",
    })
   return false;
   } 
   const pIdCount = records.filter(x => x.productId === data.productId).length;
    if(pIdCount != 0) {
      setError("productId", {
        type: "manual",
        message: "Product Id is already existing",
      })
   return false;
   } 
   return true;
 }
 
 // This function will handle the submission.
 async function handleRegistration(data) {
  const valid = formValidation(data); 
   if(valid){
   await fetch("http://localhost:5000/update", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(data),
   })
   .catch(error => {
     window.alert(error);
     return;
   }); 
   props.changeTab('Add','Success');
  }  
 }
 
 // This following section will display the form that takes the input from the user.
 return (
   <div>
     {/* <h3>Add Products</h3> */}
     <form onSubmit={handleSubmit(handleRegistration)}> 
      <div className="product-group col-md-12">
       <div className="form-group col-md-12">
         <label htmlFor="productName">Name</label>
         <input
           type="text"
           className="form-control"
           id="productName"
           placeholder="Enter Product Name"
           disabled={isSubmitting}        
           {...register('productName', {
            required: "Please enter product name",
            value:form.productName,
            minLength: { value: 3, message: "Min Length must be more than 3" },
            maxLength: { value: 30, message: "Max Length cannot exceed more than 30" } }) }   
         />
          <small className="text-danger">
          {errors?.productName && errors.productName.message}
        </small>  
       </div>
       <div className="form-group col-md-12">
         <label htmlFor="productId">Id</label>
         <input
           type="text"
           className="form-control"
           id="productId"
           placeholder="Enter Product Id"      
           disabled={isSubmitting}             
           {...register('productId', { 
            required: "Please enter product id",
            minLength: { value: 3, message: "Min Length must be more than 3" },
            maxLength: { value: 30, message: "Max Length cannot exceed more than 30" } }) }
         />
        <small className="text-danger">
          {errors?.productId && errors.productId.message}
        </small>  
       </div>    
       <div className="form-group col-md-12">
         <label htmlFor="price">Price</label>
         <input
           type="number"
           className="form-control"
           id="price"
           placeholder="Enter Product Price"
           disabled={isSubmitting}        
           {...register('price', { 
            required: "Please enter price",
            maxLength: { value: 4, message: "Price cannot be more than 9999" } }) }
         />
          <small className="text-danger">
          {errors?.price && errors.price.message}
        </small>  
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
           onClick={()=> props.changeTab('Add')}
         />
       </div>
       </div>      
     </form>
   </div>
 );
}