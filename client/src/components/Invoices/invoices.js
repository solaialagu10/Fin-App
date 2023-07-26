import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form"; 
import '../styles.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import DatalistInput from 'react-datalist-input';
import 'react-datalist-input/dist/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
 import axios from 'axios';
export default function Invoices() {
  const [item, setItem] = useState(); 
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [billedinvoices, setBilledinvoices] = useState([]);
  const [form, setForm] = useState({
    customer:"",
    customerName: "",
    retailPrices:""
  });
  const [
    isSuccessfullySubmitted,
    setIsSuccessfullySubmitted,
  ] = useState('');
  const { register, handleSubmit,watch,formState: { errors,isSubmitting,isSubmitSuccessful },setError,reset,setValue,getValues } = useForm({mode : "all",defaultValues:{winningAmount:0}})
  // This method fetches the records from the database.
 useEffect(() => {
  async function getCustomers() {
    const response = await axios.get(`customers`);
    setCustomers(response.data) 
  }
  async function getProducts() {    
    const response = await axios.get(`products`);
    setProducts(response.data);
  }
  async function getBilledInvoices() {    
    const response = await axios.get(`billedInvoices`);   
    setBilledinvoices(response.data);
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
           type="text"
           className="form-control table-input-control"
           name={`retailPrices.${props.product.productId}`}    
           disabled={true}  
           {...register(`retailPrices.${props.product.productId}`)}               
         />         
    </td>    
    <td style={{padding:"0.1rem"}}>
    <input
           type="number"
           className={`form-control table-input-control ${errors.qtys?.[props.product.productId] ? 'is-invalid' : ''}`}
           name={`qtys.${props.product.productId}`}  
           disabled={isSubmitting}   
           onWheel={(e) => e.target.blur()}
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
           if(isNaN(data["winningAmount"])) data["winningAmount"] = 0;    
          data["totalBalance"] = data["billTotal"] + data["totalBalance"];  
          data["totalBalance"] = data["totalBalance"] - data["winningAmount"];         
          try {
            const response =  await axios.post("add_invoice", data)
            console.log("<><><><"+JSON.stringify(response));
            if(response?.data){ 
                setIsSuccessfullySubmitted('Success');
              }             
            } catch (e) {   
              setIsSuccessfullySubmitted('Error');     
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
      name="customer"
      onSelect={(item) => { setItem(item.id); setValue('timeline','')}}
      items= {Object.keys(customers).map(function(key) {
        return {id :customers[key]._id,value: customers[key].customerName};
      })}
      {...register('customer')}             
     />
     <div className="form-group col-md-12">
         <label htmlFor="name">Balance</label>         
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
      </div>
      <div className="form-group col-md-12">
         <label htmlFor="name">Cash prize</label>         
         <input
           className={`form-control  ${errors.winningAmount ? 'is-invalid' : ''}`}
           type="number"
           name="winningAmount"   
           onWheel={(e) => e.target.blur()}    
           {...register('winningAmount',{   
            value: 0,    
            valueAsNumber:true,
            validate: {
              positive: v => parseInt(v) >= 0 || "Incorrect value"
            }
            })}             
         />
         <small className="invalid-feedback">
          {errors.winningAmount?.message}
          </small>
         </div>
         <input
           type="text"
           className="form-control"
           name="totalCost"            
           hidden={true}        
           {...register('totalCost')}             
         />
       
      <div>
      <select
                className={`form-select custom-select  ${errors.timeline ? 'is-invalid' : ''}`}
                  id="selectmethod"
                  defaultValue=""
                  name="timeline"
                  disabled ={item?.length>0 ? false : true}
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
   
      {watch("timeline")?.length >0 ? <table className="table table-striped table-bordered">
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
       </table> :""}
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
              {
                setItem('');
                setForm({                
                customer:''
              });
              
            }}          
          ></input>
        </div>
       </div>       
    
    <Accordion style={{width:"100%",float:"left",marginTop:"6px"}}>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Billed invoices</Accordion.Header>
        <Accordion.Body>
        {item?.length > 0 ?<table className="table table-striped table-bordered custom-table table-fit" >
          <thead>
            <tr>
              <th>Timeline</th>
           { products.map((product,index) => {
              return (
                      <th>{product.productName}</th>
              );
            })}
             <th>W Amount</th>
             <th>Bill Total</th>
            </tr>
          </thead>
          <tbody>
          {(billedinvoices.filter(x => x.customerId === item)).map((billedInvoice,index) => {
              return (
                <tr>
                      <td>{billedInvoice.timeline}</td>
                      {Object.keys(billedInvoice.qtys).map((key,index) =>{ 
                     return (<td> {billedInvoice.qtys[key]} * {billedInvoice.retailPrices[key]}  </td>)
                      })}
                      <td>{billedInvoice.winningAmount}</td>
                      <td>{billedInvoice.billTotal}</td>
                </tr>
              );
            })}
          </tbody>
          </table> :""}
        </Accordion.Body>
      </Accordion.Item>
      </Accordion>
      </form>
   </div>
 );
}