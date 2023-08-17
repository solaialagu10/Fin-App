import React, { useState,  useEffect } from "react";
import Accordion from 'react-bootstrap/Accordion';
import { MdDelete,MdEditSquare,MdClear } from "react-icons/md";
import ModalOutlet from "../../common/modal";
const BilledInvoices = React.memo(function BilledInvoices(props) {
  const [invoice, setInvoice] = React.useState('');
  const [modalShow, setModalShow] = React.useState(false);
  const [body, setBody] = React.useState('');
  const [title, setTitle] = React.useState('');
  let prevBalance = (props.billedinvoices.find(x => x.customerId === props.item))?.outstandingBalance;
  prevBalance = prevBalance !==undefined ? prevBalance : 0;  
  function callbackHandler(){
    if(props.action ==='DELETE'){
           props.deleteInvoice(invoice);
    }
    else{
          props.editInvoice(invoice);
    }
  }
    return(
      <>
      <Accordion style={{width:"100%",float:"left",marginTop:"6px"}}  activeKey={props.active} onSelect={(e) => {props.setActive(e)}}>
      <Accordion.Item eventKey="0"  >
        <Accordion.Header >Billed invoices</Accordion.Header>       
        <Accordion.Body>
        {props.item?.length > 0 ?<table className="table table-bordered custom-table table-fit" >
          <thead>
            <tr>
              <th>Timeline</th>
           { (props.products).map((product,index) => {
              return (
                      <th>{product.productName}</th>
              );
            })}
             <th>Excess</th>
             <th>Total Cost</th>
             <th>Bill Amount</th>
             <th>Options</th>
            </tr>
          </thead>
          <tbody>
          {((props.billedinvoices).filter(x => x.customerId === props.item)).map((billedInvoice,index) => {
              return (
                <tr>
                      <td style={{background:"lightgreen"}}>{billedInvoice.timeline}</td>
                      {Object.keys(billedInvoice.qtys).map((key,index) =>{ 
                     return (<td> {billedInvoice.qtys[key]} </td>)
                      })}
                      <td>{billedInvoice.winningAmount}</td>
                      <td>{billedInvoice.billTotal}</td>
                      <td>{billedInvoice.billTotal - billedInvoice.winningAmount}</td> 
                      <td> <MdDelete onClick={(e) => {setModalShow(true);
                          setTitle('Delete Invoice');
                          setBody('Do you want to delete invoice for '+billedInvoice.timeline);
                          props.setAction('DELETE');
                          setInvoice(billedInvoice);}
                      } style={{cursor:"pointer",fontSize: '16px'}}/>
                           <MdEditSquare onClick={(e) => {setModalShow(true);
                          setTitle('Edit Invoice');
                          setBody('Do you want to edit invoice for '+billedInvoice.timeline);
                          props.setAction('EDIT');
                          setInvoice(billedInvoice);}
                      }  style={{cursor:"pointer",fontSize: '16px'}}/>
                      </td>                     
                </tr>
              );
            })}
            {props.billedinvoices.filter(x => x.customerId === props.item).length >0 ?  <tr style={{borderTop:"none",borderBottom:"none"}}>
              <td style={{background:"white",border:"none"}}></td>
              {(props.billedinvoices.filter(x => x.customerId === props.item)).map((billedInvoice,index) => {
                return(
                  index === 0 ? Object.keys(billedInvoice.qtys).map((key,index) =>{ 
                    return <td style={{background:"white",border:"none"}}></td>
                     }) :"")
                    })}              
              <td style={{background:"white",border:"none"}}></td>
              <td style={{fontWeight:"bold"}}>Old Balance</td>
            <td>{ prevBalance }</td>
            </tr>:""}        
           {props.billedinvoices.filter(x => x.customerId === props.item).length >0 ? <tr style={{borderTop:"none",borderBottom:"none"}}>
              <td style={{background:"white",border:"none"}}></td>
              {(props.billedinvoices.filter(x => x.customerId === props.item)).map((billedInvoice,index) => {
                return(
                  index === 0 ? Object.keys(billedInvoice.qtys).map((key,index) =>{ 
                    return <td style={{background:"white",border:"none"}}></td>
                     }) :"")
                    })}              
              <td style={{background:"white", border:"none"}}></td>
              <td style={{fontWeight:"bold"}}>Curr Balance</td>
            <td>{(Object.values(props.billedinvoices.filter(x => x.customerId === props.item))).map((billedInvoice) => 
                      billedInvoice.billTotal - billedInvoice.winningAmount).reduce((a, b) => a + b, 0) + prevBalance
            }</td>
            </tr>:""}
          </tbody>          
          </table> :""}
        </Accordion.Body>
      </Accordion.Item>
      </Accordion>
       <ModalOutlet show={modalShow} onHide={() => setModalShow(false)} body={body} title ={title} function={()=>callbackHandler()}/>
      </>
    )
});

export default BilledInvoices;