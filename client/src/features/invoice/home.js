import React, { useState,  useEffect } from "react";
import { useForm } from "react-hook-form"; 
import '../../common/styles.css';
import DatalistInput from 'react-datalist-input';
import 'react-datalist-input/dist/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; 
import  BilledInvoices  from "./billedInvoices";
import { useContextData } from "../../context/Mycontext";
export default function Home() {  
  const {products,customers, updateCustomers} = useContextData();  
  const [active, setActive]  = React.useState([]);
  const [balance, setBalance] = useState(0);
  const [item, setItem] = useState(); 
  const [billedinvoices, setBilledinvoices] = useState([]);
  const [form, setForm] = useState([]);
  const [isSuccessfullySubmitted,setIsSuccessfullySubmitted] = useState('');
  const [message,setMessage] = useState('');
  const [loading,setLoading] = useState(false);
  const [formError,setFormError] = useState(false);
  const [action, setAction] = React.useState('');
  const [editBillAmount, setEditBillAmount] = React.useState('');
  const { register, handleSubmit,watch,formState: { errors,isSubmitting,isSubmitSuccessful },setError,reset,setValue,getValues} = useForm()
   
 useEffect(() => {
  async function getBilledInvoices() {    
    try{
      const response = await axios.get(`billedInvoices`);
      setBilledinvoices(response.data);
    }
    catch(e){
      setFormError(true);
    }
  }
  getBilledInvoices();  
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
async function  deleteInvoice (invoice) {
  try{      
      setIsSuccessfullySubmitted('');
      setMessage('');
      setError(false);
      setLoading(true);
      setBilledinvoices(billedinvoices.filter(x => x._id !== invoice._id));
      const value = getValues('totalBalance');
      const response =  await axios.post("delete_invoice", invoice);  
      updateCustomers(response.data);
      setMessage('Invoice deleted successfully');     
      reset('');
      setValue('totalBalance',value - (invoice.billTotal - invoice.winningAmount))
      
  }
  catch(e){
    setFormError(true);         
  } finally{
    setLoading(false);
  }
}

function editInvoice(invoice) {
  let value;
  if(isSuccessfullySubmitted === 'Success'){
    value = balance;
  }else{
    value = getValues('totalBalance');  
  }
  reset();  
  setIsSuccessfullySubmitted('');
  setMessage('');
  setError(false);
  const customer = customers.filter(x => x._id === item);
  invoice['wholeSalePrices'] = customer[0].wholeSalePrices;
  invoice['totalBalance'] = value;
  setEditBillAmount(invoice['billTotal']);
  setForm(invoice);  
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
           disabled={isSuccessfullySubmitted === 'Success' || isSubmitting }   
           placeholder="0"
           onWheel={(e) => e.target.blur()}
           onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
           {...register(`qtys.PId${props.product.productId}`,{
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
            validate: {
              matchPattern: (v) => /^[0-9]\d*|^$/.test(v) || "Only positive values are allowed"
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
           {...register(`totals.PId${props.product.productId}`,{
           defaultValue : 0})}         
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
const handleRegistration = async (data) => {
  setMessage('');
  if(data["billTotal"] !== 0){     
        let Arr = [];
           if(isNaN(data["winningAmount"])) data["winningAmount"] = 0;     
           Object.keys(data.qtys).forEach(function (key,index) {             
            if(data.qtys[key] === '') {data.qtys[key]=0;}
            if(action === 'EDIT'){ Arr.push(data.qtys[key] * data.wholeSalePrices[key]);}
           });
          try {
            let response;            
            if(action === 'EDIT'){              
              data['totalBalance'] = (data['totalBalance'] - editBillAmount) + (data['billTotal'] - data['winningAmount']);
              setValue('totalBalance',data['totalBalance']);
              setBalance(data['totalBalance']);
              const totalCost = Arr.reduce((a, b) => a + b, 0);
              data["totalCost"] = totalCost;
              response = await axios.post("edit_invoice", data);  
              setAction('');
            }else{
              data['totalBalance'] = data['totalBalance'] + data['billTotal'] - data['winningAmount'];
              setValue('totalBalance',data['totalBalance']);
              setBalance(data['totalBalance']);
              response = await axios.post("add_invoice", data);      
            }  
            if(response?.data){ 
                updateCustomers(response.data);
                const response1 = await axios.get(`billedInvoices`);   
                setBilledinvoices(response1.data);
                setActive("0");
                setIsSuccessfullySubmitted('Success');
              }             
            } catch (e) {   
              setFormError(true);
          } 
  }
 }
 
 return (
   <div>  
     <form onSubmit={handleSubmit(handleRegistration)}> 
     <div className="text-success" style={{fontWeight : "600"}}>{isSuccessfullySubmitted === 'Success' ? "Invoice submitted successfully." : ""}</div>      
     <div className="text-success" style={{fontWeight : "600"}}>{message?.length > 0 ? message : ""}</div>           
     <div className="text-danger" style={{fontWeight : "600"}}>{formError ? "Service is down, please try again later" : ""}</div>
    {(isSubmitting || loading) && (<div class="overlay">
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
      onSelect={(item) => { setItem(item.id); setValue('timeline',''); setIsSuccessfullySubmitted('');}}
      items= {Object.keys(customers).map(function(key) {
        return {id :customers[key]._id,value: customers[key].customerName};
      })}
      {...register('customer')}         
     ></DatalistInput>
     
     <div className="form-group col-md-12">
         <label htmlFor="name">Balance</label>         
         <input
           type="text"
           className="form-control"
           name="totalBalance"      
           style={{background:"indianred"}}      
           disabled={true}        
           {...register('totalBalance',{
            value:0})}             
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
           disabled = {isSuccessfullySubmitted === 'Success' || isSubmitting}
           onWheel={(e) => e.target.blur()}    
           onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
           {...register('winningAmount',{    
            valueAsNumber:true,
            validate: {
              positive: v => (parseInt(v) >= 0 || isNaN(parseInt(v))) || "Incorrect value"
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
                  disabled ={(item?.length>0 && action !== 'EDIT')  ? false : true}
                  {...register("timeline", { 
                    onChange:(e)=>{ if(isSuccessfullySubmitted === 'Success' )
                     { let val = e.target.value; reset(); setValue('totalBalance',balance); 
                     setValue('timeline',val); setIsSuccessfullySubmitted(''); 
                    }},
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
           disabled={isSubmitting || isSuccessfullySubmitted === 'Success'}
           className="btn btn-primary"
         />
         </div>
         <div className="cancel-btn">
          <input
            type="reset"
            value="Reset"
            disabled={isSubmitting || isSuccessfullySubmitted === 'Success'}
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
    <BilledInvoices billedinvoices={billedinvoices} 
        products={products} 
        active={active}
        setActive={(e)=>setActive(e)} 
        item={item}
        deleteInvoice={deleteInvoice} editInvoice={editInvoice}
        action={action} setAction={(value)=>setAction(value)}/>    
      </form>
   </div>
 );
}