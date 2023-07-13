import React, { useMemo, useState }  from "react";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import cellEditFactory from 'react-bootstrap-table2-editor';
import 'bootstrap/dist/css/bootstrap.min.css';

  
  function ReactBSTables (props){

    const [selected, setSelected] = useState([]);
    const [selectedRw, setSelectedRw] = useState([]);
    const [columns1, setColumns1] = useState([]);
    const dataTable = props.data;  
    const columns = props.columns;
    if(dataTable[0] && columns1?.length===0 && props.keyField === 'customerName')
    {   
    Object.keys(dataTable[0].retailPrices).map((key, index) => {
      let header = {};
      header = {
        "dataField": key,
        "text": key,  
        "sort": true
      }
      columns1.push(header);
    })
  }

  async function afterSaveCell(oldValue, newValue, row, column, done) {   
      row.totalBalance = row.totalBalance - row.amountPaid;
        const settings = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(row),
        };
      try {        
        const fetchResponse =  await fetch("http://localhost:5000/update_amount", settings)
        if(fetchResponse.ok){ 
            // setIsSuccessfullySubmitted('Success');
          }
          else{
            // setIsSuccessfullySubmitted('Error');
          }
        } catch (e) {        
          console.log("<><<>< error"+e);
      }
    
    return { async: true };
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
          <BootstrapTable data={[row.retailPrices]} 
          columns={columns1} keyField={columns1[0].dataField}/>
        ),
        onlyOneExpanding: true,
        showExpandColumn: true,
        expandHeaderColumnRenderer: ({ isAnyExpands }) => (null)
      };
      return (          
        <>
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
          <ToolkitProvider
            data={dataTable}
            keyField={props.keyField}
            columns={columns}           
            search
          >
            {props => (
              <div className="py-2">
                <div
                  id="datatable-basic_filter"
                  className="dataTables_filter  pb-2"
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
                {columns1.length > 0 ?
                <div className="table-responsive">
                <BootstrapTable
                  {...props.baseProps}
                  pagination={pagination}
                  bordered={true}
                  selectRow={ selectRow } 
                  expandRow={expandRow}
                  cellEdit={ cellEditFactory({ mode: 'dbclick',
                  blurToSave: true, afterSaveCell }) }
                />
                </div> :  <div className="table-responsive">
                <div></div>
                <BootstrapTable
                  {...props.baseProps}
                  pagination={pagination}
                  bordered={true}
                  selectRow={ selectRow }                   
                />
                </div>}
              </div>
            )}
          </ToolkitProvider>
        </>
      );    
  }
  
  export default ReactBSTables;