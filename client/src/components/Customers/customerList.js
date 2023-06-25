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
  const [dataTable,setDataTable] = useState([
    {
        "Name": "horn-od926",
        "Position": "selection-gsykp",
        "Office":"XDH",
        "Age": 22,
        "Start Date": "24-Jan-2020",
        "Salary": 39
    },
    {
        "Name": "heart-nff6w",
        "Position": "information-nyp92",
        "Office":"XDH",
        "Age": 16,
        "Start Date": "12-Mar-2022",
        "Salary": 40
    },
    {
        "Name": "minute-yri12",
        "Position": "fairies-iutct",
        "Office":"XDH",
        "Age": 7,
        "Start Date": "05-Dec-2021",
        "Salary": 39
    },
    {
        "Name": "degree-jx4h0",
        "Position": "man-u2y40",
        "Office":"XDH",
        "Age": 27,
        "Start Date": "15-Aug-2022",
        "Salary": 92
    }
  ]);
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
      <ReactBSTables data={dataTable}/>
    </div>
  );
}
 
