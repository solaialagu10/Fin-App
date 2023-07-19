import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form"; 
import '../styles.css';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';

export default function AddProducts(props) {

  // form validation rules 
  const validationSchema = Yup.object().shape({ 
    productName:  Yup.string()
        .required('Please enter product name')
        .min(3,"Name must be at least 3 characters")
        .max(75,"Name cannot exceed more than 75 characters")
        .matches(/^[a-zA-Z0-9 -]+$/, "Only characters are allowed"),
    productId:  Yup.string()
        .required('Please enter product id')
        .min(3,"Location must be at least 3 characters")
        .max(75,"Location cannot exceed more than 75 characters")
        .matches(/^[a-zA-Z0-9 -]+$/, "Only characters are allowed"),
    price:  Yup.string()
        .required('Please enter product price')
        .max(4, "Price cannot be more than 9999")    
});

const formOptions = { resolver: yupResolver(validationSchema) };
const { register, handleSubmit,formState: { errors,isSubmitting },setError,reset,setFocus } = useForm(formOptions)
const [records, setRecords] = useState([]);
const [
  isSuccessfullySubmitted,
  setIsSuccessfullySubmitted,
] = useState('');
const [form, setForm] = useState({
  productName: "",
  productId: "",
  price: ""
});

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
  getRecords();
  setFocus("productName")
  return;
}, [setFocus,form]);

useEffect(() => {
  reset(form);
}, [form])
 
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
    const settings = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    try {
      const fetchResponse =  await fetch("http://localhost:5000/add_product", settings)
      if(fetchResponse.ok){ 
          setIsSuccessfullySubmitted('Success');
        }
        else{
          setIsSuccessfullySubmitted('Error');
        }
      } catch (e) {        
        console.log("<><<>< error"+e);
    } 
      reset({ productName: "", productId: "", price: "" });
   }   
 }
 
 // This following section will display the form that takes the input from the user.
 return (
   <div>
     {/* <h3>Add Products</h3> */}
     <form onSubmit={handleSubmit(handleRegistration)}>
     <div className="text-success">{isSuccessfullySubmitted === 'Success' ? "Product added successfully." : ""}</div>      
     <div className="text-danger">{isSuccessfullySubmitted === 'Error' ? "Error in adding product" : ""}</div> 
     {props.row === 'Success' && <div className="text-success">Product edited successfully.</div>}
      <div className="product-group col-md-12">
       <div className="form-group col-md-12">
         <label htmlFor="productName">Name</label>
         <input
           type="text"
           className={`form-control ${errors.productName ? 'is-invalid' : ''}`}
           name="productName"            
           placeholder="Enter Product Name"   
           disabled={isSubmitting}        
           {...register('productName') }               
         />
          <small className="invalid-feedback">
          {errors.productName?.message}
        </small>      
       </div>
       <div className="form-group col-md-12">
         <label htmlFor="productId">Id</label>
         <input
           type="text"
           className={`form-control ${errors.productId ? 'is-invalid' : ''}`}
           name="productId"
           placeholder="Enter Product Id"
           disabled={isSubmitting}
           {...register('productId') }
         />
         <small className="invalid-feedback">
          {errors.productId?.message}
        </small>          
       </div>    
       <div className="form-group col-md-12">
         <label htmlFor="price">Price</label>
         <input
           type="number"
           className={`form-control ${errors.price ? 'is-invalid' : ''}`}
           name="price"
           onWheel={(e) => e.target.blur()}
           placeholder="Enter Product Price"
           disabled={isSubmitting}
           {...register('price') }
         />
         <small className="invalid-feedback">
          {errors.price?.message}
        </small>      
       </div>   
       </div>
       <div className="product-group-buttons">    
        <div className="form-group  pull-right delete-btn">
          <input
            type="submit"
            value="Save"
            disabled={isSubmitting}
            className="btn btn-primary"
          />
        </div>
        <div className="cancel-btn">          
           <input
            type="reset"
            value="Cancel"
            disabled={isSubmitting}
            className="btn btn-primary"    
            onClick={() =>
              setForm({
                productName: '',
                productId: '',
                price: ''
              })
            }       
          ></input>
        </div>
       </div>   
       
     </form>
   </div>
 );
}