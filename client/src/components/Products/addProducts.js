import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form"; 
import '../styles.css';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import { useContextData } from "../../context/Mycontext";
export default function AddProducts(props) {

  const {products, updateProducts} = useContextData();  
  // form validation rules 
  const validationSchema = Yup.object().shape({ 
    productName:  Yup.string()
        .required('Please enter product name')
        .max(75,"Name cannot exceed more than 75 characters")
        .matches(/^[a-zA-Z0-9 -]+$/, "Only characters are allowed"),
    productId:  Yup.string()
        .required('Please enter product id')
        .max(75,"Location cannot exceed more than 75 characters")
        .matches(/^[a-zA-Z0-9 -]+$/, "Only characters are allowed"),
    price:  Yup.string()
        .required('Please enter product price') 
});

const formOptions = { resolver: yupResolver(validationSchema) };
const { register, handleSubmit,formState: { errors,isSubmitting },setError,reset,setFocus } = useForm(formOptions)

const [
  isSuccessfullySubmitted,
  setIsSuccessfullySubmitted,
] = useState('');
const [form, setForm] = useState({
  productName: "",
  productId: "",
  price: ""
});
 
 function formValidation(data){
  const pNameCount = products.filter(x => x.productName === data.productName).length;   
  if(pNameCount != 0) {
    setError("productName", {
      type: "manual",
      message: "Product Name is already existing",
    })
   return false;
   } 
   const pIdCount = products.filter(x => x.productId === data.productId).length;
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
    try {
      const response =  await axios.post("add_product", data)
      if(response.data)
          setIsSuccessfullySubmitted('Success');
          updateProducts(response.data);
      } catch (e) {        
        setIsSuccessfullySubmitted('Error');
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
     {isSubmitting && (<div class="overlay">
                  <div class="overlay__wrapper">
                    <div class="spinner-grow text-primary overlay__spinner" 
              id="spinner"role="status">
            <span class="sr-only"></span>
        </div></div></div>)}
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
           type="text"
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