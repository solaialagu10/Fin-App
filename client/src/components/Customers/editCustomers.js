import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form"; 
import '../styles.css';
import axios from "axios";
import { useContextData } from "../../context/Mycontext";
export default function EditCustomers(props) {
  const {customers,  updateCustomers} =useContextData();
  const {products, setProducts} = useContextData();  
  const { register, handleSubmit,formState: { errors,isSubmitting,isSubmitSuccessful },setError,reset,setValue } = useForm()
  const [form, setForm] = useState({
    customerName: "",
    location: "",
    mobileNo: "",
    email:"",
    retailPrices:""
  });
  useEffect(() => {
    async function setData() {
      console.log(JSON.stringify(props.row[0]));
      setForm(props.row[0]);
    }
    setData();
    return;
  }, [props.row]);

  useEffect(()=>{
    reset(form);
  },[form])

  function formValidation(data){
    const custNameCount = customers.filter(x => (x.customerName === data.customerName && form.customerName !== data.customerName)).length;  
    if(custNameCount != 0) {
      setError("customerName", {
        type: "manual",
        message: "Customer name is already existing",
      })
     return false;
     }
    const mobileNoCount = customers.filter(x => (parseInt(x.mobileNo,10) === parseInt(data.mobileNo,10) &&  parseInt(form.mobileNo,10) !== parseInt(data.mobileNo,10))).length;   
    if(mobileNoCount != 0) {
      setError("mobileNo", {
        type: "manual",
        message: "Mobile number is already existing",
      })
     return false;
     }
     const emailCount = customers.filter(x => (x.email === data.email && form.email !== data.email)).length;   
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
 async function handleRegistration(data) {
  // const valid = formValidation(data);
  if(true){
    try{
      const response =  await axios.post("edit_customer", data);
      updateCustomers(response.data);
    }
   catch(error) {
    console.log("<><<>< error"+error);
     window.alert(error);
     return;
   };
   props.changeTab('Add','Success');
  }  
 }
 const Record = (props) => (
  <tr>
    <td>{props.product.productName}</td>
    <td>{props.product.productId}</td>
    <td style={{display:"flex"}}>
    <input
           type="text"
           className="form-control"
           name={`retailPrices.PId${props.product.productId}`}         
           placeholder="Enter Price"   
           disabled={isSubmitting}
           style={{width:"100%"}}    
           {...register(`retailPrices.PId${props.product.productId}`,{
            required: "Please enter price",
            onBlur: (e) => {
              var num = parseFloat(e.target.value);
              var cleanNum = num.toFixed(2);
              if(!isNaN(cleanNum)) setValue(`retailPrices.PId${props.product.productId}`,cleanNum);
            },
            validate: {
              matchPattern: (v) => /^[0-9]\d*/.test(v) || "Only positive values are allowed"
            }
          })}               
         />
         <div className="invalid-feedback" style={{display:"flex"}}>
          {errors.retailPrices?.[props.product.productId]?.message}
        </div>
    </td>    
  </tr>
 );
 function recordList() {
  if(products && products.length > 0){
   return products.map((product,index) => {
     return (
       <Record
         product={product}
       />
     );
   });
 }
 }
 // This following section will display the form that takes the input from the user.
 return (
   <div>    
     {/* <h3>Add New Customers</h3> */}
     {isSubmitting && (<div class="overlay">
                  <div class="overlay__wrapper">
                    <div class="spinner-grow text-primary overlay__spinner" 
              id="spinner"role="status">
            <span class="sr-only"></span>
        </div></div></div>)}
     <form onSubmit={handleSubmit(handleRegistration)}>      
     <div className="product-group col-md-12">
       <div className="form-group col-md-12">
         <label htmlFor="name">Name</label>         
         <input
           type="text"
           className={`form-control ${errors.customerName ? 'is-invalid' : ''}`}
           name="customerName"            
           placeholder="Enter Customer Name"   
           disabled={isSubmitting}        
           {...register('customerName',{
            required:'Please enter customer name',
            validate: {
              minLength: (v) => v.length >= 3 || "Name must be at least 3 characters",
              maxLength: (v) => v.length <75 || "Name cannot exceed more than 75 characters",
              matchPattern: (v) => /^[a-zA-Z0-9- ]+$/.test(v) || "Name must contain only letters, numbers and -",
            }
           })}               
         />
          <small className="text-danger">
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
           {...register('location',{
            required:'Please enter location',
            validate: {
              minLength: (v) => v.length >= 3 || "Name must be at least 3 characters",
              maxLength: (v) => v.length <75 || "Name cannot exceed more than 75 characters",
              matchPattern: (v) => /^[a-zA-Z0-9- ]+$/.test(v) || "Location must contain only letters, numbers and -",
            }
           })}               
         />
          <small className="text-danger">
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
           {...register('mobileNo',{
            setValueAs: (v) => v === null ? "" : v,
            validate: {
              // maxLength: (v) => v?.length <= 11  || "Mobile no should not exceed 11 digits", --> Later add lenght validation 
              matchPattern: (v) => (/[0789][0-9]{9}|^$/.test(v)) || "Invalid mobile no" }
             })}                
         />
          <small className="text-danger">
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
           {...register('email',{
            validate: {
              maxLength: (v) =>
              v.length <= 50 || "The email should have at most 50 characters",
              matchPattern: (v) =>
              /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$|^$/.test(v) || "Email must be a valid address", }
             }) }               
         />
          <small className="text-danger">
          {errors.email?.message}
          </small>
       </div> 
       <div className="cust-table" style={{ marginTop: 20 }}>
       <table className="table table-striped table-bordered">
       <thead>
         <tr>
          <th>Product Name</th>
           <th>Product ID</th>
           <th>Retail Price</th>
         </tr>
       </thead>
       <tbody>{recordList()}</tbody>
       </table>  
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
            onClick={()=> props.changeTab('Add')}         
          ></input>
        </div>
       </div>
    </div>
    </form>     
   </div>
 );
}