import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form"; 
import '../styles.css';
import axios from "axios";
export default function EditCustomers(props) {
   
  const { register, handleSubmit,formState: { errors,isSubmitting,isSubmitSuccessful },setError,reset } = useForm()
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    customerName: "",
    location: "",
    mobileNo: "",
    email:"",
    retailPrices:""
  });
  useEffect(() => {
    async function setData() {
      setForm(props.row[0]);
    }
    async function getCustomers() {
      const response = await axios.get("customers");
      setCustomers(response.data);
    }
    async function getProducts() {    
      const response = await axios.get("products");   
      setProducts(response.data);
    }
    setData();
    getCustomers();
    getProducts();
    return;
  }, [props.row]);
  useEffect(() => {
    reset(form);
  }, [form]);

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
  const valid = formValidation(data);
  if(valid){
   await axios.post("edit_customer", data)
   .catch(error => {
    console.log("<><<>< error"+error);
     window.alert(error);
     return;
   });
   props.changeTab('Add','Success');
  }  
 }
 const Record = (props) => (
  <tr>
    <td>{props.product.productName}</td>
    <td>{props.product.productId}</td>
    <td style={{display:"flex"}}>
    <input
           type="number"
           className="form-control"
           name={`retailPrices.${props.product.productId}`}         
           placeholder="Enter Price"   
           disabled={isSubmitting}
           style={{width:"100%"}}    
           pattern="[0-9]+" title="please enter number only"    
           {...register(`retailPrices.${props.product.productId}`,{
            required: "Please enter price",
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
            required : "Please enter mobile no",
            validate: {
             matchPattern: (v) => /[0789][0-9]{9}/.test(v) || "Invalid mobile no" }
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
            required : "Please enter email id",
            validate: {
              maxLength: (v) =>
              v.length <= 50 || "The email should have at most 50 characters",
              matchPattern: (v) =>
              /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "Email must be a valid address", }
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