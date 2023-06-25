import React, { useEffect, useState } from "react";
import ReactBSTables from '../tableBootstrap';
const Record = (props) => (
  <tr>
    <td>{props.record.name}</td>
    <td>{props.record.id}</td>
    <td>{props.record.price}</td>    
  </tr>
 );
export default function ProductList(props){
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
  const columns=[{
    "dataField": "productName",
    "text": "Product Name",
    "sort": true
},{
  "dataField": "productId",
  "text": "Product Id",
  "sort": true
},{
  "dataField": "price",
  "text": "Price",
  "sort": true
},{
  "dataField": "createdDate",
  "text": "Created Date",
  "sort": true
},{
  "dataField": "modifiedDate",
  "text": "Modified Date",
  "sort": true
}]
  const [selected, setSelected] = useState([]);
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

    // This method fetches the records from the database.
 useEffect(() => {
  async function getRecords() {
    
    const response = await fetch(`http://localhost:5000/products/`);

    if (!response.ok) {
      const message = `An error occurred: ${response.statusText}`;
      window.alert(message);
      return;
    }

    const records = await response.json();
    console.log("<><><>records" +JSON.stringify(records));
    setRecords(records);
  }
  getRecords();
  return;
}, []);
// This method will delete a record
async function deleteRecord(selected) {
  const toDelete = [selected];
  console.log("selected"+JSON.stringify(selected));
  await fetch(`http://localhost:5000/delete`, {
    headers: {'Content-Type': 'application/json'},
    method: "POST",
    body: JSON.stringify({selected})
  });

  // const newRecords = records.filter((el) => el._id !== id);
  // setRecords(newRecords);
}

  return (
    <div>
      {/* <h3>Product List</h3> */}
      
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
      <ReactBSTables data={records} columns={columns} deleteRecord={deleteRecord}/>
    </div>
  );
}
 
