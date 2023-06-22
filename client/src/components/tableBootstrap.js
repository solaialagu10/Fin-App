import React, { useMemo }  from "react";

import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit';

import 'bootstrap/dist/css/bootstrap.min.css';



  
  function ReactBSTables (props){

    const dataTable = props.data;

    const columns =  React.useMemo(() => Object.keys(dataTable[0]).map((key,id) => {
        return {
            dataField: key,
            text: key,
            sort: true
        };
      }),[]);


    const pagination = paginationFactory({
        page: 1,
        alwaysShowAllBtns: true,
        showTotal: true,
        withFirstAndLast: false,
        sizePerPageRenderer: ({ options, currSizePerPage, onSizePerPageChange }) => (
          <div className="dataTables_length" id="datatable-basic_length">
            <label>
              Show{" "}
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
      
      const { SearchBar } = Search;
      
      return (
        <>
          <ToolkitProvider
            data={dataTable}
            keyField="name"
            columns={columns}
            search
          >
            {props => (
              <div className="py-4">
                <div
                  id="datatable-basic_filter"
                  className="dataTables_filter px-4 pb-1"
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
                <BootstrapTable
                  {...props.baseProps}
                  bootstrap4={true}
                  pagination={pagination}
                  bordered={false}
                />
              </div>
            )}
          </ToolkitProvider>
        </>
      );    
  }
  
  export default ReactBSTables;