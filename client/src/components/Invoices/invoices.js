import React, { useState, useMemo, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form"; 
import '../styles.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
import DatalistInput from 'react-datalist-input';
import 'react-datalist-input/dist/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Accordion from 'react-bootstrap/Accordion';
import axios from 'axios'; 
import { useContextData } from "../../context/Mycontext";
import AccordionCollapse from "react-bootstrap/esm/AccordionCollapse";
export default function Invoices() {  
  const {products, updateCustomers} = useContextData();  
  const {customers, setCustomers} =useContextData(); 
  const [active, setActive]  = React.useState([]);
  const [item, setItem] = useState(); 
  const [billedinvoices, setBilledinvoices] = useState([]);
  const [balance, setBalance] = useState(0); 
  const [form, setForm] = useState({
    customer:"",
    customerName: "",
    retailPrices:""
  });
  const [
    isSuccessfullySubmitted,
    setIsSuccessfullySubmitted,
  ] = useState('');
  const { register, handleSubmit,watch,formState: { errors,isSubmitting,isSubmitSuccessful },setError,reset,setValue,getValues } = useForm()
  // This method fetches the records from the database.
 
 useEffect(() => {
  async function getBilledInvoices() {    
    const response = await axios.get(`billedInvoices`);   
    setBilledinvoices(response.data);
  }
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
  if(cur.length > 0){
  return parseInt(prev) + parseInt(cur);
  }
  return prev;
}

const Record = (props) => (
  <tr>
    <td>{props.product.productName}</td>
    <td>{props.product.productId}</td>
    <td style={{padding:"0.1rem"}}>
    <input
           type="text"
           className="form-control table-input-control"
           name={`retailPrices.PId${props.product.productId}`}    
           disabled={true}  
           {...register(`retailPrices.PId${props.product.productId}`)}               
         />         
    </td>    
    <td style={{padding:"0.1rem"}}>
    <input
           type="number"
           className={`form-control table-input-control ${errors.qtys?.[props.product.productId] ? 'is-invalid' : ''}`}
           name={`qtys.PId${props.product.productId}`}  
           disabled={isSubmitting}   
           onWheel={(e) => e.target.blur()}
           onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
           {...register(`qtys.PId${props.product.productId}`,{
            required: true,
            onChange: (e) => {
              setValue(`totals.PId${props.product.productId}`, (e.target.value * getValues(`retailPrices.PId${props.product.productId}`)))
              setValue(`costTotals.PId${props.product.productId}`, (e.target.value * getValues(`wholeSalePrices.PId${props.product.productId}`)))            
              const vals = document.getElementsByClassName('totalClass');
              let  values = [...vals].map(input => input.value)
              const billTotal = values.reduce(getSum,0);
              setValue("billTotal",billTotal);
              const vals2 = document.getElementsByClassName('costTotalClass');
              let  values2 = [...vals2].map(input => input.value)
              const costTotal = values2.reduce(getSum,0);
              setValue("totalCost",costTotal);
            },
              onBlur:(e)=>{
                let balance = getValues("totalBalance");
                let productTotal =getValues(`totals.PId${props.product.productId}`);
                let currValue = e.target.value;
                let prevValue = isNaN(parseInt(e.target.dataset.prevValue)) ? 0 : parseInt(e.target.dataset.prevValue)
                let direction = currValue > prevValue ? 'up' : 'down'
                e.target.dataset.prevValue = currValue;
                  if(direction === 'up'){
                        setValue("totalBalance",balance + productTotal);
                        }
                  else{
                    let subTotal = (prevValue-currValue) * getValues(`retailPrices.PId${props.product.productId}`);
                    setValue("totalBalance",balance - subTotal);
                  }
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
           type="text"
           className="form-control table-input-control totalClass"
           disabled={true}
           name={`totals.PId${props.product.productId}`}       
           {...register(`totals.PId${props.product.productId}`)}         
         />
         <input
           type="text"
           className="costTotalClass"
           hidden={true}
           style={{display:"none"}}   
           name={`costTotals.PId${props.product.productId}`}       
           {...register(`costTotals.PId${props.product.productId}`,{
            required: false})}                 
         />
    </td>  
    <input
           type="text"     
           hidden={true}
           style={{display:"none"}}
           {...register(`wholeSalePrices.PId${props.product.productId}`,{
            required: false})}                       
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
          try {
            setBalance(data['totalBalance'])
            const response =  await axios.post("add_invoice", data);        
            if(response?.data){ 
                updateCustomers(response.data);
                const response1 = await axios.get(`billedInvoices`);   
                setBilledinvoices(response1.data);
                setActive("0");
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
     <form onSubmit={handleSubmit((e)=>handleRegistration(e))}> 
     <div className="text-success">{isSuccessfullySubmitted === 'Success' ? "Invoice submitted successfully." : ""}</div>      
    <div className="text-danger">{isSuccessfullySubmitted === 'Error' ? "Error in submitting Invoice" : ""}</div>
    {isSubmitting && (<div class="overlay">
                  <div class="overlay__wrapper">
                    <div class="spinner-grow text-primary overlay__spinner" 
              id="spinner"role="status">
            <span class="sr-only"></span>
        </div></div></div>)}
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
           style={{background:"indianred"}}      
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
           style={{background:"lightpink"}}     
           disabled={true}        
           {...register('billTotal',{
            value:0})}             
         />
      </div>
      <div className="form-group col-md-12">
         <label htmlFor="name">Excess</label>         
         <input
           className={`form-control  ${errors.winningAmount ? 'is-invalid' : ''}`}
           type="number"
           name="winningAmount"   
           placeholder="0"
           style={{background:"greenyellow"}}
           onWheel={(e) => e.target.blur()}    
           onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
           {...register('winningAmount',{    
            valueAsNumber:true,
            validate: {
              positive: v => (parseInt(v) >= 0 || isNaN(parseInt(v))) || "Incorrect value"
            },
              onBlur:(e)=>{
                let balance = getValues("totalBalance");
                let currValue =  isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value);
                let prevValue = isNaN(parseInt(e.target.dataset.prevValue)) ? 0 : parseInt(e.target.dataset.prevValue)
                let direction = currValue > prevValue ? 'up' : 'down'
                e.target.dataset.prevValue = currValue;
                  if(direction === 'up'){
                        setValue("totalBalance",balance - currValue);
                        }
                  else{                  
                    setValue("totalBalance",(balance + prevValue));
                  }
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
                  style={{background:"lightgreen"}} 
                  disabled ={item?.length>0 ? false : true}
                  {...register("timeline", { 
                    onChange:(e)=>{ if(isSuccessfullySubmitted === 'Success')
                     { let val = e.target.value; reset(); setValue('totalBalance',balance); 
                     setValue('timeline',val); setIsSuccessfullySubmitted(''); }},
                    required: 'Please select any timeline option' })}
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
                reset();
                setItem('');
                setForm({                
                customer:''
              });
              
            }}          
          ></input>
        </div>
       </div>       
    
    <Accordion style={{width:"100%",float:"left",marginTop:"6px"}}  activeKey={active} onSelect={(e) => {setActive(e)}}>
      <Accordion.Item eventKey="0"  >
        <Accordion.Header >Billed invoices</Accordion.Header>       
        <Accordion.Body activeKey={active}>
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