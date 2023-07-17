import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form"; 
import '../styles.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import DatalistInput from 'react-datalist-input';
import 'react-datalist-input/dist/styles.css';

 
export default function Invoices() {
  const [item, setItem] = useState(); 
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [billedinvoices, setBilledinvoices] = useState([]);
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
  async function getBilledInvoices() {    
    const response = await fetch(`http://localhost:5000/billedInvoices/`);
    console.log(response);
    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }
    const invoices = await response.json();
    setBilledinvoices(invoices);
  }
  getProducts();
  getCustomers();
  getBilledInvoices();
  return;
}, []);

useEffect(() => {
  const customer = customers.filter(x => x._id === item);
  setForm(...customer)
}, [item]);

useEffect(() => {
  reset(form);
}, [form]);

function getSum(prev, cur) {
  return prev + cur;  
}

const Record = (props) => (
  <tr>
    <td>{props.product.productName}</td>
    <td>{props.product.productId}</td>
    <td style={{padding:"0.1rem"}}>
    <input
           type="number"
           className="form-control table-input-control"
           name={`retailPrices.${props.product.productId}`}    
           disabled={true}
           pattern="[0-9]+" title="please enter number only"    
           {...register(`retailPrices.${props.product.productId}`)}               
         />         
    </td>    
    <td style={{padding:"0.1rem"}}>
    <input
           type="number"
           className={`form-control table-input-control ${errors.qtys?.[props.product.productId] ? 'is-invalid' : ''}`}
           name={`qtys.${props.product.productId}`}  
           disabled={isSubmitting}   
           {...register(`qtys.${props.product.productId}`,{
            required: true,
            onChange: (e) => {
              setValue(`totals.${props.product.productId}`, (e.target.value * getValues(`retailPrices.${props.product.productId}`)))
              setValue(`costTotals.${props.product.productId}`, (e.target.value * getValues(`wholeSalePrices.${props.product.productId}`)))
              var obj = JSON.parse(JSON.stringify(getValues("totals")));
              var values = Object.keys(obj).map(function (key) { return obj[key]; });
              const SumValue = values.reduce(getSum,0); 
              setValue("billTotal",SumValue);
              var obj = JSON.parse(JSON.stringify(getValues("costTotals")));
              var values = Object.keys(obj).map(function (key) { return obj[key]; });
              const SumValue1 = values.reduce(getSum,0); 
              setValue("totalCost",SumValue1);
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
    <td style={{padding:"0.1rem"}}>
    <input
           type="number"
           className="form-control table-input-control"
           disabled={true}
           name={`totals.${props.product.productId}`}       
           {...register(`totals.${props.product.productId}`)}         
         />
         <input
           type="number"
           className="form-control"
           hidden={true}
           name={`costTotals.${props.product.productId}`} 
           style={{width:"100%"}}      
           {...register(`costTotals.${props.product.productId}`)}         
         />
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

 async function handleRegistration(data) {
 
  if(data){
    // let sumValue =0;
    //  Object.keys(data.totals).map((key) =>   sumValue += data.totals[key])          
          data["totalBalance"] = data["billTotal"] + data["totalBalance"];  
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
     <div className="text-success">{isSuccessfullySubmitted === 'Success' ? "Invoice submitted successfully." : ""}</div>      
    <div className="text-danger">{isSuccessfullySubmitted === 'Error' ? "Error in submitting Invoice" : ""}</div>
    <div className="invoice-container-head">
      <div className="invoice-customers">
      <DatalistInput
      placeholder="Search..."
      label="Select Customers"
      className="invoice-datalist"
      onSelect={(item) => setItem(item.id)}
      items= {Object.keys(customers).map(function(key) {
        return {id :customers[key]._id,value: customers[key].customerName};
      })}
     />
     <div className="form-group col-md-12">
         <label htmlFor="name">Balance Amount</label>         
         <input
           type="text"
           className="form-control"
           name="totalBalance"            
           disabled={true}        
           {...register('totalBalance')}             
         />
       </div>
     </div>
      <div className="invoice-timeframe">
      <div className="form-group col-md-12">
         <label htmlFor="name">Bill total</label>         
         <input
           type="text"
           className="form-control"
           name="billTotal"            
           disabled={true}        
           {...register('billTotal')}             
         />
         <input
           type="text"
           className="form-control"
           name="totalCost"            
           hidden={true}        
           {...register('totalCost')}             
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
                  <option value="2 PM" disabled ={true ? billedinvoices.filter(x => x.timeline === "2 PM" && x.customerId === item).length > 0: false}>2 PM</option>
                  <option value="3 PM" disabled ={true ? billedinvoices.filter(x => x.timeline === "3 PM" && x.customerId === item).length > 0: false}>3 PM</option>
                  <option value="5 PM" disabled ={true ? billedinvoices.filter(x => x.timeline === "5 PM" && x.customerId === item).length > 0: false}>5 PM</option>
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