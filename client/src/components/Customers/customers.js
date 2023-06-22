import React, { useState } from "react";
import { useNavigate } from "react-router";
import CustomerList from "./customerList";
import '../styles.css';
 
export default function Customers() {
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
 const [form, setForm] = useState({
   name: "",
   location: "",
   mobileNo: "",
   email:"",

 });
 const navigate = useNavigate();
 
 // These methods will update the state properties.
 function updateForm(value) {
   return setForm((prev) => {
     return { ...prev, ...value };
   });
 }
 
 // This function will handle the submission.
 async function onSubmit(e) {
   e.preventDefault();
 
   // When a post request is sent to the create url, we'll add a new record to the database.
   const newPerson = { ...form };
 
   await fetch("http://localhost:5000/add_customer", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
     },
     body: JSON.stringify(newPerson),
   })
   .catch(error => {
     window.alert(error);
     return;
   });
 
   setForm({ name: "", position: "", level: "" });
   navigate("/home");
 }
 
 // This following section will display the form that takes the input from the user.
 return (
   <div>
     <h3>Add New Customers</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group col-md-12">
         <label htmlFor="name">Name</label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={form.name}
           onChange={(e) => updateForm({ name: e.target.value })}
           placeholder="Enter customer's Name"
         />
       </div>
       <div className="form-group col-md-12">
         <label htmlFor="location">Location</label>
         <input
           type="text"
           className="form-control"
           id="location"
           value={form.location}
           onChange={(e) => updateForm({ location: e.target.value })}
           placeholder="Enter customer's Location"
         />
       </div>    
       <div className="form-group col-md-12">
         <label htmlFor="mobileNo">Mobile No</label>
         <input
           type="text"
           className="form-control"
           id="mobileNo"
           value={form.mobileNo}
           onChange={(e) => updateForm({ mobileNo: e.target.value })}
           placeholder="Enter customer's Mobile No"
         />
       </div>   
       <div className="form-group col-md-12">
         <label htmlFor="email">Email</label>
         <input
           type="text"
           className="form-control"
           id="email"
           value={form.email}
           onChange={(e) => updateForm({ email: e.target.value })}
           placeholder="Enter customer's Email Id"
         />
       </div>   
       <div className="form-group col-md-4 pull-right">
         <input
           type="submit"
           value="Add Customer"
           className="btn btn-primary"
         />
       </div>
     </form>
     <CustomerList data={dataTable}/>
   </div>
 );
}