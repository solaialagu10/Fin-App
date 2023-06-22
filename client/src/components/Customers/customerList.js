import React, { useState } from "react";
import ReactBSTables from '../tableBootstrap';
const Record = (props) => (
  <tr>
    <td>{props.record.name}</td>
    <td>{props.record.id}</td>
    <td>{props.record.price}</td>    
  </tr>
 );
export default function CustomerList(props){
  const [records, setRecords] = useState([]);
  function recordList() {
    if(records && records.length > 0){
     return records.map((record) => {
       return (
         <Record
           record={record}
           key={record._id}
         />
       );
     });
   }
   }

  return (
    <div>
      <h3>Customer List</h3>
      {/* <table className="table table-striped" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Id</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>{recordList()}</tbody>
      </table> */}
      {/* <BasicTableComponent data={props.data}/> */}
      <ReactBSTables data={props.data}/>
    </div>
  );
}
 
