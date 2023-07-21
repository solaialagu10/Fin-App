import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import '../login.css';
import {Link} from 'react-router-dom';
function Register() {    
    const [error,setError]=useState('')
    const [message,setMessage]=useState('')
    const {
        register,
        handleSubmit,
        formState: { errors,isSubmitting },
    } = useForm();
 
    const onSubmit = async (data) => {
        console.log("<><><><> "+JSON.stringify(data));
        setError("");
        setMessage("");
        const settings = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          };
          try {
            const response =  await fetch("http://localhost:5000/register", settings)
            const res = await response.json();
            console.log("<<><>res"+JSON.stringify(res));
           if(res.message?.length > 0)
                setMessage(res.message);
                else setError(res.error);
            } catch (e) {        
              console.log("<><<>< error"+e);
              setError("Error in regsitering user, please try again later");
          } 
    };
    return (
        <div className="col-md-12">
            <div className="login-card card-container">
                <img
                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                alt="profile-img"
                className="profile-img-card"
                />
                {!message && <div> <p className="mt-6 text-center text-3xl font-extrabold text-gray-900" >
                    Already have an account? <Link to='/login' className="font-medium text-purple-600 hover:text-purple-500">
                    Login
                    </Link>
                </p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                         <label htmlFor="userName">Username</label>
                         <input type="text"
                         className="form-control"
                         name="userName"
                         {...register("userName", { required: 'Username is mandatory' })} />
                          <small className="invalid-feedback">
                                {errors.userName?.message}
                           </small>
                    </div>
                    <div className="form-group">
                       <label htmlFor="email">Email</label>                       
                        <input type="text" 
                        name="email"
                        className="form-control" 
                        {...register("email")} />                        
                    </div>
                    <div className="form-group">
                       <label htmlFor="password">Password</label>                       
                        <input type="password" 
                        name="password"
                        className="form-control" 
                        {...register("password")} />                        
                    </div>
                    <div className="form-group">
                       <label htmlFor="confirmPassword">Confirm Password</label>                       
                        <input type="password" 
                        name="confirmPassword"
                        className="form-control" 
                        {...register("confirmPassword")} />                        
                    </div>
                    <div className="form-group">
                            <input type="submit" value="Signup" className="btn btn-primary btn-block" disabled={isSubmitting} /> 
                            {isSubmitting && (
                                <span className="spinner-border spinner-border-sm"></span>
                            )}
                           
                    </div>                   
                </form>
                </div>}

                {error && 
                        <div className="text-danger">
                            {error}
                        </div>
                     }
                     {message && 
                        <div className="success-msg">
                            <div className="text-success"> 
                                {message}
                            </div>
                            <p>
                            Return to <Link to='/login' className="font-medium text-purple-600 hover:text-purple-500">
                            login
                            </Link>
                            </p>
                        </div>
                     }
            </div>
        </div>
    );
}
export default Register;