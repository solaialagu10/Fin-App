import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form"; 
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import '../styles.css';
 
export default function AddCustomers(props) {

   // form validation rules 
   const validationSchema = Yup.object().shape({ 
    customerName:  Yup.string()
        .required('Please enter customer name')
        .min(3,"Name must be at least 3 characters")
        .max(75,"Name cannot exceed more than 75 characters")
        .matches(/^[a-zA-Z0-9 -]+$/, "Only characters are allowed"),
    location:  Yup.string()
        .required('Please enter location')
        .min(3,"Location must be at least 3 characters")
        .max(75,"Location cannot exceed more than 75 characters")
        .matches(/^[a-zA-Z0-9 -]+$/, "Only characters are allowed"),
    mobileNo:  Yup.string()
        .required('Please enter mobile no')
        .matches(/[0789][0-9]{9}/, "Invalid mobile no"),
    email: Yup.string()
        .required('Please enter email id')
        .email('Email is invalid')
        .matches(/[^@\s]+@[^@\s]+\.[^@\s]+/,'Email is invalid')
});
  const formOptions = { resolver: yupResolver(validationSchema) };
  const { register, handleSubmit,formState: { errors,isSubmitting },setError,reset,setFocus} = useForm(formOptions)
  const [records, setRecords] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [
    isSuccessfullySubmitted,
    setIsSuccessfullySubmitted,
  ] = useState('');
  const [form, setForm] = useState({
    customerName: "",
    location: "",
    mobileNo: "",
    email:""
  });

  useEffect(() => {
    async function getRecords() {    
      const response = await fetch(`http://localhost:5000/products/`);
      console.log(response);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
      const records = await response.json();
      setRecords(records);
    }
    async function getCustomers() {
    const response = await fetch(`http://localhost:5000/customers/`);
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const customers = await response.json();
    setCustomers(customers);
  }
    getCustomers();
    getRecords();
    setFocus("customerName")
    return;
  }, [setFocus,form]); 

  useEffect(() => {
    reset(form);
  }, [form])

  function formValidation(data){
    const custNameCount = customers.filter(x => x.customerName === data.customerName).length;  
    if(custNameCount != 0) {
      setError("customerName", {
        type: "manual",
        message: "Customer name is already existing",
      })
     return false;
     }
    const mobileNoCount = customers.filter(x => parseInt(x.mobileNo,10) === parseInt(data.mobileNo,10)).length;   
    if(mobileNoCount != 0) {
      setError("mobileNo", {
        type: "manual",
        message: "Mobile number is already existing",
      })
     return false;
     }
     const emailCount = customers.filter(x => x.email === data.email).length;   
    if(emailCount != 0) {
      setError("email", {
        type: "manual",
        message: "Email id is already existing",
      })
     return false;
     }
     return true;
    }
 
 // This function will handle the submission.
 const handleRegistration=  async (data) => {
 
   // When a post request is sent to the create url, we'll add a new record to the database.
  //  const newPerson = { ...form };
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
      const fetchResponse =  await fetch("http://localhost:5000/add_customer", settings)
      if(fetchResponse.ok){ 
          setIsSuccessfullySubmitted('Success');
        }
        else{
          setIsSuccessfullySubmitted('Error');
        }
      } catch (e) {        
        console.log("<><<>< error"+e);
    } 
    setForm({ customerName: "", location: "", mobileNo: "",email:"" });
  }
 }
 
 // This following section will display the form that takes the input from the user.
 return (
   <div>    
     {/* <h3>Add New Customers</h3> */}
     <form onSubmit={handleSubmit(handleRegistration)}>
    <div className="text-success">{isSuccessfullySubmitted === 'Success' ? "Customer added successfully." : ""}</div>      
    <div className="text-danger">{isSuccessfullySubmitted === 'Error' ? "Error in adding customer" : ""}</div>
     {props.row === 'Success' && <div className="text-success">Customer edited successfully.</div>}
     <div className="product-group col-md-12">
       <div className="form-group col-md-12">
         <label htmlFor="name">Name</label>         
         <input
           type="text"
           className={`form-control ${errors.customerName ? 'is-invalid' : ''}`}
           name="customerName"            
           placeholder="Enter Customer Name"   
           disabled={isSubmitting}        
           {...register('customerName') }               
         />
          <small className="invalid-feedback">
          {errors.customerName?.message}
        </small>
       </div>
       <div className="form-group col-md-12">
         <label htmlFor="location">Location</label>         
         <input
           type="text"
           className={`form-control ${errors.location ? 'is-invalid' : ''}`}
           name="location"            
           placeholder="Enter customer's location"   
           disabled={isSubmitting}        
           {...register('location') }               
         />
          <small className="invalid-feedback">
          {errors.location?.message}
        </small>
       </div>    
       <div className="form-group col-md-12">
         <label htmlFor="mobileNo">Mobile No</label>         
         <input
           type="number"
           className={`form-control ${errors.mobileNo ? 'is-invalid' : ''}`}
           name="mobileNo"            
           placeholder="Enter customer's mobile no"   
           disabled={isSubmitting}        
           {...register('mobileNo') }               
         />
          <small className="invalid-feedback">
          {errors.mobileNo?.message}
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
           {...register('email') }               
         />
          <small className="invalid-feedback">
          {errors.email?.message}
          </small>
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
            value="Reset"
            disabled={isSubmitting}
            className="btn btn-primary" 
            onClick={() =>
              setForm({
                customerName: '',
                location: '',
                mobileNo: '',
                email:''
              })
            }          
          ></input>
        </div>
       </div>
    </div>
    </form>     
   </div>
 );
}