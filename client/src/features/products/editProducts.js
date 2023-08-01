import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import '../../common/styles.css';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from "axios";
import { useContextData } from "../../context/Mycontext";
export default function EditProducts(props) {
  const {products, updateProducts} = useContextData(); 
  const [apierror,setApierror] = useState(false); 
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
});
const formOptions = { resolver: yupResolver(validationSchema) };
const { register, handleSubmit,formState: { errors,isSubmitting },setError,reset,setValue } = useForm(formOptions)
 const [form, setForm] = useState({
   productName: "",
   productId: "",
   price: ""

 });
 useEffect(() => {
  async function setData() {
    setForm(props.row[0]);
  }
  setData();
  return;
}, [props.row]);

useEffect(() => {
  reset(form);
}, [form]);
 
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
  // const valid = formValidation(data);  
    try{
    const response = await axios.post("update", data);
    updateProducts(response.data);
    props.changeTab('Add','Success');  
    }
    catch(e){
      setApierror(true); 
    }
 }
 
 // This following section will display the form that takes the input from the user.
 return (
   <div>
     <div className="text-danger">{apierror ? "Service is down, please try again later" : ""}</div>
     {isSubmitting && (<div class="overlay">
                  <div class="overlay__wrapper">
                    <div class="spinner-grow text-primary overlay__spinner" 
              id="spinner"role="status">
            <span class="sr-only"></span>
        </div></div></div>)}
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
           type="text"
           className="form-control"
           id="price"
           placeholder="Enter Product Price"
           disabled={isSubmitting}        
           {...register('price', { 
            required: "Please enter price" }) }
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