import React, { useMemo, useState }  from "react";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import cellEditFactory from 'react-bootstrap-table2-editor';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from "axios";
import { useContextData } from "../context/Mycontext";
  function ReactBSTables (props){
    const {customers, updateCustomers} =useContextData();
    const [selected, setSelected] = useState([]);
    const [selectedRw, setSelectedRw] = useState([]);
    const [issubmit,setIssubmit] = useState(false);
    const [error,setError] = useState(false);
    const datatable = props.data;
    const columns = props.columns;    
    const keyField  =props.keyField;

 async function savePaidrows(){
    try {        
        setIssubmit(true);
        const fetchResponse =  await axios.post("update_amount", datatable);
        updateCustomers(fetchResponse.data);        
        } catch (e) {       
          setError(true); 
          console.log("<><<>< error"+e);
      }finally{
        setIssubmit(false);
      }
  }

  async function afterSaveCell(oldValue, newValue, row, column, done) {   
    if(newValue > 0){
      row['amountPaid'] = newValue;    
    return { async: true };
    }
  }
    const pagination = paginationFactory({
        page: 1,
        alwaysShowAllBtns: true,
        showTotal: true,
        withFirstAndLast: false,
        sizePerPageRenderer: ({ options, currSizePerPage, onSizePerPageChange }) => (
          <div className="dataTables_length" id="datatable-basic_length">
            <label>
              Show {" "}
              {
                <select
                  name="datatable-basic_length"
                  aria-controls="datatable-basic"
                  className="form-control form-control-sm"
                  onChange={e => onSizePerPageChange(e.target.value)}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              }{" "}
              entries.
            </label>
          </div>
        )
      });

      function handleOnSelect (row, isSelect) {        
        if (isSelect) {         
          setSelected(selected => [...selected,{"_id":row._id}]);
          setSelectedRw(selectedRw => [...selectedRw,row])
        } else {     
          setSelected(selected.filter(x => x._id !== row._id))
          setSelectedRw(selectedRw.filter(x => x._id !== row._id))
          };
        }
      

      function handleOnSelectAll (isSelect, rows) {
        const ids = rows.map(r => ({"_id" : r._id}));
        if (isSelect) {
          setSelected(ids);
          setSelectedRw(rows);
        } else {
          setSelected([]);
          setSelectedRw([]);
        }
      }
      
      const { SearchBar } = Search;

      const selectRow = {
        mode: 'checkbox',
        clickToSelect: true,
        clickToEdit: true,
        onSelect: handleOnSelect,
        onSelectAll: handleOnSelectAll        
      };

      const expandRow = {        
        renderer: row => (
          <table className="table table-striped table-bordered custom-table">
              <thead>
              <tr>
                <th>Amount paid</th>
                <th>Date</th>                
              </tr>
            </thead>
            <tbody>
              {((props.paidList).filter(x => {return x.customerId === row._id;})).map((paidlist,index) => {
                return (
                      <tr>
                        <td>{paidlist.amount}</td>
                        <td>{paidlist.date}</td>
                      </tr>
                );
              })}            
            </tbody>
            <div className="text-info info-class">* Last 3 day payments</div>
        </table> 
        ),
        onlyOneExpanding: true,
        showExpandColumn: true,
        expandHeaderColumnRenderer: ({ isAnyExpands }) => (null)
      };
      const rowStyle = { backgroundColor: '#c8e6c9', height: '40px', padding: '5px 0' }
      return (          
        <>
         {issubmit && (<div class="overlay">
                  <div class="overlay__wrapper">
                    <div class="spinner-grow text-primary overlay__spinner" 
              id="spinner"role="status">
            <span class="sr-only"></span>
        </div></div></div>)}
        <div className="text-danger">{error ? "Service is down, please try again later" : ""}</div>
        <div >
          <div className="form-group delete-btn">
            <button
              value="Edit"
              className="btn btn-primary"
              disabled={selectedRw.length !== 1}
              onClick={()=> props.editRecord(selectedRw)}
            >Edit</button>
          </div>
            <div className="form-group delete-btn">
            <input
              type="submit"
              value="Delete"
              className="btn btn-primary"
              onClick={()=> props.deleteRecord(selected)}
            />
          </div>
          {keyField === "customerName" ? <div className="form-group delete-btn">
              <input
                type="submit"
                value="Save"
                className="btn btn-primary"
                onClick={()=> savePaidrows()}
              />
            </div> : ""}
          </div>
          <div >
            <ToolkitProvider
              data={datatable}
              keyField={props.keyField}
              columns={columns}           
              search
            >
              {props => (
                <div className="py-2">
                  <div
                    id="datatable-basic_filter"
                    className="dataTables_filter  pb-3"
                  >
                    <label>
                      <SearchBar
                        className="form-control-sm"
                        placeholder=""
                        srText=""
                        {...props.searchProps}
                      />
                    </label>
                  </div>                
                  {keyField === "customerName" ?
                 <> <div className="table-responsive">
                  <BootstrapTable
                    {...props.baseProps}
                    pagination={pagination}
                    bordered={true}
                    selectRow={ selectRow } 
                    expandRow={expandRow}
                    cellEdit={ cellEditFactory({ mode: 'dbclick' ,style:{content: '0'},
                    blurToSave: true, afterSaveCell }) }
                    rowStyle={ rowStyle }
                  />
                  </div></> :  <div className="table-responsive">
                  <div></div>
                  <BootstrapTable
                    {...props.baseProps}
                    pagination={pagination}
                    bordered={true}
                    selectRow={ selectRow }                   
                    rowStyle={ rowStyle }
                  />
                  </div>}
                </div>
              )}              
            </ToolkitProvider>
            {keyField === "customerName" ? <div className="text-info info-class">* Double click on amount paid column to enter the value</div> :""}
          </div>
        </>
      );    
  }
  
  export default ReactBSTables;