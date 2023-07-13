import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form"; 
import '../styles.css';
 
export default function AddCustomers(props) {
  
  const { register, handleSubmit,formState: { errors,isSubmitting },setError,reset,setFocus,setValue} = useForm()
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [
    isSuccessfullySubmitted,
    setIsSuccessfullySubmitted,
  ] = useState('');
  const [form, setForm] = useState({
    customerName: "",
    location: "",
    mobileNo: "",
    email:"",
    totalBalance:0,
    amountPaid:0
  });

  useEffect(() => {
    async function getProducts() {    
      const response = await fetch(`http://localhost:5000/products/`);
      console.log(response);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        window.alert(message);
        return;
      }
      const products = await response.json();
      setProducts(products);
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
    getProducts();
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
  console.log("<><><><> "+JSON.stringify(data));
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

 const Record = (props) => (
  <tr>
    <td>{props.product.productName}</td>
    <td>{props.product.productId}</td>
    <td style={{display:"flex"}}>
    <input
           type="number"
           className={`form-control ${errors.retailPrices?.[props.product.productId] ? 'is-invalid' : ''}`}
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
    <input
           type="number"
           className="form-control"
           name={`wholeSalePrices.${props.product.productId}`}      
           hidden={true}
           value={props.product.price}
           {...register(`wholeSalePrices.${props.product.productId}`)}               
    />    
  </tr>
 );
 // This method will map out the records on the table
 function recordList() {
  if(products && products.length > 0){
   return products.map((product,index) => {
     return (
       <Record
         product={product}
         key={product._id}
         index={index}
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
           {...register('customerName',{
            required:'Please enter customer name',
            validate: {
              minLength: (v) => v.length >= 3 || "Name must be at least 3 characters",
              maxLength: (v) => v.length <75 || "Name cannot exceed more than 75 characters",
              matchPattern: (v) => /^[a-zA-Z0-9- ]+$/.test(v) || "Name must contain only letters, numbers and -",
            }
           })}             
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
           {...register('location',{
            required:'Please enter location',
            validate: {
              minLength: (v) => v.length >= 3 || "Name must be at least 3 characters",
              maxLength: (v) => v.length <75 || "Name cannot exceed more than 75 characters",
              matchPattern: (v) => /^[a-zA-Z0-9- ]+$/.test(v) || "Location must contain only letters, numbers and -",
            }
           })}               
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
           {...register('mobileNo',{
           required : "Please enter mobile no",
           validate: {
            maxLength: (v) => v.length <= 11 || "Mobile no should not exceed 11 digits",
            matchPattern: (v) => /[0789][0-9]{9}/.test(v) || "Invalid mobile no" }
            })}               
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
           {...register('email',{
            required : "Please enter email id",
            validate: {
              maxLength: (v) =>
              v.length <= 50 || "The email should have at most 50 characters",
              matchPattern: (v) =>
              /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "Email must be a valid address", }
             }) }               
         />
          <small className="invalid-feedback">
          {errors.email?.message}
          </small>
       </div>  
       <div className="cust-table" style={{ marginTop: 20 }}>
       <table className="table table-striped table-bordered " >
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