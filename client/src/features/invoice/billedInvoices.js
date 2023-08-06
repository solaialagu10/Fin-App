import React, { useState,  useEffect } from "react";
import Accordion from 'react-bootstrap/Accordion';
import { MdDelete,MdEditSquare,MdClear } from "react-icons/md";
import ModalOutlet from "../../common/modal";
const BilledInvoices = React.memo(function BilledInvoices(props) {
  const [invoice, setInvoice] = React.useState('');
  const [modalShow, setModalShow] = React.useState(false);
  const [body, setBody] = React.useState('');
  const [title, setTitle] = React.useState('');
 
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
        <Accordion.Body activeKey={props.active}>
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
             <th>Bill Total</th>
             <th>Balance</th>
             <th>Options</th>
            </tr>
          </thead>
          <tbody>
          {((props.billedinvoices).filter(x => x.customerId === props.item)).map((billedInvoice,index) => {
              return (
                <tr>
                      <td>{billedInvoice.timeline}</td>
                      {Object.keys(billedInvoice.qtys).map((key,index) =>{ 
                     return (<td> {billedInvoice.qtys[key]} * {billedInvoice.retailPrices[key]}  </td>)
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
           {props.billedinvoices.filter(x => x.customerId === props.item).length >0 ? <tr>
              <td></td>
              {(props.billedinvoices.filter(x => x.customerId === props.item)).map((billedInvoice,index) => {
                return(
                  index === 0 ? Object.keys(billedInvoice.qtys).map((key,index) =>{ 
                    return <td></td>
                     }) :"")
                    })}              
              <td></td>
              <td style={{fontWeight:"bold"}}>Total</td>
            <td>{(Object.values(props.billedinvoices.filter(x => x.customerId === props.item))).map((billedInvoice) => 
                      billedInvoice.billTotal - billedInvoice.winningAmount).reduce((a, b) => a + b, 0)
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