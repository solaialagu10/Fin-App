import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form"; 
import '../styles.css';
// import Button from "react-bootstrap/Button";
// import Dropdown from "react-bootstrap/Dropdown";
// import DropdownButton from "react-bootstrap/DropdownButton";
// import 'bootstrap/dist/css/bootstrap.min.css';
import DatalistInput from 'react-datalist-input';
import 'react-datalist-input/dist/styles.css';

 
export default function Invoices() {
  const [item, setItem] = useState(); 
  const [customer, setCustomer] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    customerName: "",
    retailPrices:""
  });
  const [
    isSuccessfullySubmitted,
    setIsSuccessfullySubmitted,
  ] = useState('');
  const { register, handleSubmit,formState: { errors,isSubmitting,isSubmitSuccessful },setError,reset,setValue,getValues } = useForm({mode : "all"})
  // This method fetches the records from the database.
 useEffect(() => {
  async function getCustomers() {
    const response = await fetch(`http://localhost:5000/customers/`);
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const customers = await response.json();   
    setCustomers(customers) 
     // Make sure each option has an unique id and a value   
  }
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
  getProducts();
  getCustomers();
  return;
}, []);

useEffect(() => {
  console.log("<><><<>"+item);
  const customer = customers.filter(x => x._id === item)
  console.log("<><>< "+JSON.stringify(customer));
  setForm(...customer)
}, [item]);

useEffect(() => {
  reset(form);
}, [form]);

const Record = (props) => (
  <tr>
    <td>{props.product.productName}</td>
    <td>{props.product.productId}</td>
    <td >
    <input
           type="number"
           className="form-control"
           name={`retailPrices.${props.product.productId}`}    
           placeholder="Enter Price"   
           disabled={true}
           style={{width:"100%"}}    
           pattern="[0-9]+" title="please enter number only"    
           {...register(`retailPrices.${props.product.productId}`)}               
         />         
    </td>    
    <td >
    <input
           type="number"
           className={`form-control ${errors.qtys?.[props.product.productId] ? 'is-invalid' : ''}`}
           name={`qtys.${props.product.productId}`}  
           disabled={isSubmitting}
           style={{width:"100%"}}     
           {...register(`qtys.${props.product.productId}`,{
            required: "Please enter qty",
            onChange: (e) => {
              setValue(`totals.${props.product.productId}`, (e.target.value * getValues(`retailPrices.${props.product.productId}`)))
            },
            validate: {
              matchPattern: (v) => /^[0-9]\d*/.test(v) || "Only positive values are allowed"
            }
          })}
         />
         <div className="invalid-feedback" style={{display:"flex"}}>
          {errors.qtys?.[props.product.productId]?.message}
        </div>
    </td>  
    <td >
    <input
           type="number"
           className="form-control"
           disabled={true}
           name={`totals.${props.product.productId}`} 
           style={{width:"100%"}}      
           {...register(`totals.${props.product.productId}`)}         
         />
         
    </td>  
  </tr>
 );

function recordList() {
  if(products && products.length > 0){
   return products.map((product,index) => {
     return (
       <Record
         product={product}
         customer={customer}
       />
     );
   });
 }
 }

 async function handleRegistration(data) {
 
  if(data){
    let sumValue =0;
     Object.keys(data.totals).map((key) =>   sumValue += data.totals[key])          
          data["billTotal"] = sumValue;  
          console.log("<><><>< "+JSON.stringify(data));
          const settings = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          };
          try {
            const fetchResponse =  await fetch("http://localhost:5000/add_invoice", settings)
            if(fetchResponse.ok){ 
                setIsSuccessfullySubmitted('Success');
              }
              else{
                setIsSuccessfullySubmitted('Error');
              }
            } catch (e) {        
              console.log("<><<>< error"+e);
          }

  }
 }
 
 // This following section will display the form that takes the input from the user.
 return (
   <div>  
     <form onSubmit={handleSubmit(handleRegistration)}> 
    <div className="invoice-container-head">
      <DatalistInput
      placeholder="Search..."
      label="Select Customers"
      className="invoice-datalist"
      onSelect={(item) => setItem(item.id)}
      items= {Object.keys(customers).map(function(key) {
        return {id :customers[key]._id,value: customers[key].customerName};
      })}
     />
      <div className="invoice-timeframe">
      <div className="form-group col-md-12">
         <label htmlFor="name">Balance Amount</label>         
         <input
           type="text"
           className="form-control"
           name="totalObalance"            
           disabled={true}        
           {...register('totalObalance')}             
         />
       </div>
      <div>
      <select
                className={`form-select custom-select  ${errors.timeline ? 'is-invalid' : ''}`}
                  id="selectmethod"
                  defaultValue=""
                  name="timeline"
                  {...register("timeline", { required: 'Please select any timeline option' })}
                >
                  <option value="" disabled>Select Timeline</option>
                  <option value="2 PM">2 PM</option>
                  <option value="3 PM">3 PM</option>
                  <option value="5 PM">5 PM</option>
                </select>
        
        </div>
      </div>
    </div>  
    <div>
    <table className="table table-striped table-bordered">
       <thead>
         <tr>
          <th>Product Name</th>
           <th>Product ID</th>
           <th>Retail Price</th>
           <th>Quantity</th>
           <th>Total</th>
         </tr>
       </thead>
       <tbody>{recordList()}</tbody>
       </table> 
    </div>
    <div className="product-group-buttons"> 
       <div className="form-group  pull-right delete-btn">
         <input
           type="submit"
           value="Submit"
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
                email:'',
                retailPrices:{}
              })
            }          
          ></input>
        </div>
       </div>
    </form>
   </div>
 );
}