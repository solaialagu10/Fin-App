import React, { useState,  useEffect} from "react";
import { useForm, useController} from "react-hook-form"; 
import '../../common/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; 
import  BilledInvoices  from "./billedInvoices";
import  useContextData  from "../../context/Mycontext";
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import { useNotificationCenter } from 'react-toastify/addons/use-notification-center';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {  
  const { notifications,clear } = useNotificationCenter();
  const [selectedOption, setSelectedOption] = useState("");
  const {products,customers, updateCustomers} = useContextData();  
  const [active, setActive]  = React.useState([]);
  const [balance, setBalance] = useState(0);
  const [billedinvoices, setBilledinvoices] = useState([]);
  const [form, setForm] = useState([]);
  const [loading,setLoading] = useState(false);
  const [action, setAction] = React.useState('');
  const [editBillAmount, setEditBillAmount] = React.useState('');
  const { register, handleSubmit,watch,formState: { errors,isSubmitting },reset,setValue,getValues,control} = useForm()
  const options = Object.keys(customers).map(function(key) {
    return {value :customers[key]._id,label: customers[key].customerName};
  });  
 useEffect(() => {
  const cancelToken = axios.CancelToken.source();    
  async function getValues() {        
      await axios.get(`billedInvoices`,{
        cancelToken : cancelToken.token
      }).then((res)=>{
        setBilledinvoices(res.data);
      }).catch((err)=>{
        if(axios.isCancel(err)){
          console.log("cancelled");
        } else {          
          toast.error('Service is down, please try again later !') 
        }
      });
  }
  getValues();  
  return()=>{
    cancelToken.cancel();
  }
}, []);

useEffect(() => {
  reset(form);
}, [form]);

const handleTypeSelect = (e) => {
  clear();
  setValue('timeline','');
  setSelectedOption(e.value);
  const customer = customers.filter(x => x._id === e.value);  
  setForm(...customer)  
};
function getSum(prev, cur) {
  if(cur.length > 0){
  return parseInt(prev) + parseInt(cur);
  }
  return prev;
}
async function  deleteInvoice (invoice) {
  try{      
      setLoading(true);
      setBilledinvoices(billedinvoices.filter(x => x._id !== invoice._id));
      const value = getValues('totalBalance');
      const response =  await axios.post("delete_invoice", invoice);  
      toast.success('Invoice deleted successfully !');
      updateCustomers(response.data); 
      reset('');
      setValue('totalBalance',value - (invoice.billTotal - invoice.winningAmount))      
  }
  catch(e){
    toast.error('Service is down, please try again later !');      
  } finally{
    setLoading(false);
  }
}
function editInvoice(invoice) {
  reset();  
  const customer = customers.filter(x => x._id === selectedOption);
  invoice['wholeSalePrices'] = customer[0].wholeSalePrices;
  invoice['totalBalance'] = getValues('totalBalance');
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
           disabled={notifications[0]?.data.title === 'Success' || isSubmitting || isNaN(getValues(`retailPrices.PId${props.product.productId}`))}   
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
              let invoice = billedinvoices.filter(x => x.customerId === data._id);
              if(invoice.length === 0){ let value = data['totalBalance']; data['outstandingBalance'] = value;} 
              else{
                data['outstandingBalance'] = invoice[0].outstandingBalance
              }             
              data['totalBalance'] = data['totalBalance'] + data['billTotal'] - data['winningAmount'];
              setValue('totalBalance',data['totalBalance']);
              setBalance(data['totalBalance']);
              response = await axios.post("add_invoice", data);      
            }  
            if(response?.data){ 
                updateCustomers(response.data);
                const response1 = await  axios.get(`billedInvoices`);   
                setBilledinvoices(response1.data);
                setActive("0");
                toast.success('Invoice submitted successfully !', {
                  data: {
                      title: 'Success',
                      text: 'This is a success message'
                  }
              });
              }             
            } catch (e) {   
              toast.error('Service is down, please try again later !');
          } 
  }
 }

 const customStyles = {
  option: (defaultStyles, state) => ({
    ...defaultStyles
  }),
  menuList: (base) => ({
    ...base,

    "::-webkit-scrollbar": {
      width: "4px",
      height: "0px",
    },
    "::-webkit-scrollbar-track": {
      background: "#d1d5d7"
    },
    "::-webkit-scrollbar-thumb": {
      background: "#31254c"
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#31254c"
    }
  }),
  control: (defaultStyles) => ({
    ...defaultStyles,
    border: 0,
    boxShadow: "none",
  })
};
 
 return (
   <div>  
    <ToastContainer />
     <form onSubmit={handleSubmit(handleRegistration)}>                       
    {(isSubmitting || loading) && (<div className="overlay">
                  <div className="overlay__wrapper">
                    <div className="spinner-grow text-primary overlay__spinner" 
              id="spinner"role="status">
            <span className="sr-only"></span>
        </div></div></div>)}
    <div className="invoice-container-head">
      <div className="invoice-customers">
        <Select
          className='select-input'
          placeholder="Select Customers"
          styles={customStyles} 
          value={selectedOption?.length > 0 ? options.find(x => x.value === selectedOption): {label:'Select Customers',value:''}}  
          // onChange={option => customerOnChange(option ? option.value : option)}   
          onChange={handleTypeSelect}       
          options= {options}      
        />
     <div className="form-group col-md-12">
         <label htmlFor="name">Balance</label>         
         <input
           type="number"
           className="form-control"
           name="totalBalance"  
           placeholder="0"
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
           placeholder="0"    
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
           disabled = {notifications[0]?.data.title === 'Success' || isSubmitting}
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
                  disabled ={(selectedOption?.length >0 && action !== 'EDIT')  ? false : true}
                  {...register("timeline", { 
                    onChange:(e)=>{ if(notifications[0]?.data.title === 'Success')
                     { let val = e.target.value; reset(); setValue('totalBalance',balance); 
                     setValue('timeline',val);  
                     clear();
                    }
                    setValue('winningAmount',0)       
                  },
                    required: 'Please select any timeline option' })}
                >
                  <option value="" disabled>Select Timeline</option>
                  <option value="2 PM" disabled ={true ? billedinvoices.filter(x => x.timeline === "2 PM" && x.customerId === selectedOption).length > 0: false}>2 PM</option>
                  <option value="3 PM" disabled ={true ? billedinvoices.filter(x => x.timeline === "3 PM" && x.customerId === selectedOption).length > 0: false}>3 PM</option>
                  <option value="5 PM" disabled ={true ? billedinvoices.filter(x => x.timeline === "5 PM" && x.customerId === selectedOption).length > 0: false}>5 PM</option>
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
           disabled={isSubmitting || notifications[0]?.data.title === 'Success'}
           className="btn btn-primary"
         />
         </div>
         <div className="cancel-btn">
          <input
            type="reset"
            value="Reset"
            disabled={isSubmitting || notifications[0]?.data.title === 'Success'}
            className="btn btn-primary" 
            onClick={() =>
              {
                reset();
                setAction('');
                clear();
                setForm([]);      
                setSelectedOption('');    
            }}          
          ></input>
        </div>
       </div>       
    <BilledInvoices billedinvoices={billedinvoices} 
        products={products} 
        active={active}
        setActive={(e)=>setActive(e)} 
        item={selectedOption}
        deleteInvoice={deleteInvoice} editInvoice={editInvoice}
        action={action} setAction={(value)=>setAction(value)}
        />    
      </form>
   </div>
 );
}