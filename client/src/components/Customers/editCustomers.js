import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form"; 
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import '../styles.css';
 
export default function EditCustomers(props) {

   // form validation rules 
   const validationSchema = Yup.object().shape({    
    email: Yup.string()
        .email('Email is invalid')
});
const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit,formState: { errors,isSubmitting,isSubmitSuccessful },setError,reset } = useForm(formOptions)
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({
    customerName: "",
    location: "",
    mobileNo: "",
    email:""
  });
  useEffect(() => {
    async function setData() {
      console.log("<><< Edit page "+JSON.stringify(props.row[0]));
      setForm(props.row[0]);
    }
    setData();
    return;
  }, [props.row]);
  useEffect(() => {
    reset(form);
  }, [form]);

 
 // This function will handle the submission.
 async function handleRegistration(data) {
 
   // When a post request is sent to the create url, we'll add a new record to the database.
  //  const newPerson = { ...form };
 
   await fetch("http://localhost:5000/edit_customer", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(data),
   })
   .catch(error => {
    console.log("<><<>< error"+error);
     window.alert(error);
     return;
   });
   props.changeTab('Add','Success');
  
 }
 
 // This following section will display the form that takes the input from the user.
 return (
   <div>    
     {/* <h3>Add New Customers</h3> */}
     <form onSubmit={handleSubmit(handleRegistration)}> 
     <div className="product-group col-md-12">
       <div className="form-group col-md-12">
         <label htmlFor="name">Name</label>         
         <input
           type="text"
           className="form-control"
           name="customerName"            
           placeholder="Enter Customer Name"   
           disabled={isSubmitting}        
           {...register('customerName', {
             required: "Please enter customer name",
             autoFocus: true,
             pattern:/^[a-zA-Z]+$/,
             minLength: { value: 3, message: "Min Length must be more than 3" },
             maxLength: { value: 30, message: "Max Length cannot exceed more than 30" } }) }               
         />
          <small className="text-danger">
          {errors?.customerName && errors.customerName.message}
        </small>
       </div>
       <div className="form-group col-md-12">
         <label htmlFor="location">Location</label>         
         <input
           type="text"
           className="form-control"
           name="location"            
           placeholder="Enter customer's location"   
           disabled={isSubmitting}        
           {...register('location', {
             required: "Please enter location",
             minLength: { value: 3, message: "Min Length must be more than 3" },
             maxLength: { value: 30, message: "Max Length cannot exceed more than 30" } }) }               
         />
          <small className="text-danger">
          {errors?.location && errors.location.message}
        </small>
       </div>    
       <div className="form-group col-md-12">
         <label htmlFor="mobileNo">Mobile No</label>         
         <input
           type="number"
           className="form-control"
           name="mobileNo"            
           placeholder="Enter customer's mobile no"   
           disabled={isSubmitting}        
           {...register('mobileNo', {
             required: "Please enter mobile number",
             pattern:/^[0-9+-]+$/,
             minLength: { value: 3, message: "Min Length must be more than 3" },
             maxLength: { value: 13, message: "Max Length cannot exceed more than 13" } }) }               
         />
          <small className="text-danger">
          {errors?.mobileNo && errors.mobileNo.message}
          </small>
       </div>   
       <div className="form-group col-md-12">
         <label htmlFor="email">Email</label>         
         <input
           type="text"
           className={`form-control ${errors.email ? 'is-invalid' : ''}`}
           name="email"            
           placeholder="Enter customer's email id"   
           disabled={isSubmitting}        
           {...register('email', {
             required: "Please enter email id",
             pattern: /^\S+@\S+$/i,
             minLength: { value: 3, message: "Min Length must be more than 3" },
             maxLength: { value: 30, message: "Max Length cannot exceed more than 30" } }) }               
         />
          <small className="text-danger">
          {errors?.email && errors.email.message}
          </small>
       </div>   
       <div className="product-group-buttons"> 
       <div className="form-group  pull-right delete-btn">
         <input
           type="submit"
           value="Save"
           className="btn btn-primary"
         />
         </div>
         <div className="cancel-btn">
          <input
            type="reset"
            value="Cancel"
            className="btn btn-primary"           
          ></input>
        </div>
       </div>
    </div>
    </form>     
   </div>
 );
}