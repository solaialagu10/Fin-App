import React, { useState,useEffect } from "react";
import { useForm } from "react-hook-form";
import '../login.css';
import {Link} from 'react-router-dom';
import axios from 'axios';
function Register() {    
    const [error,setError]=useState('')
    const [message,setMessage]=useState('')
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors,isSubmitting },
    } = useForm();
 
    const onSubmit = async (data) => {
        setError("");
        setMessage("");
          try {
            const response =  await axios.post("register", data)
            console.log("<<><>res"+JSON.stringify(response.data));
           if(response.data.message?.length > 0)
                setMessage(response.data.message);
                else setError(response.data.error);
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
                         {...register("userName", { required: 'Username is mandatory',
                                validate: {
                                minLength: (v) => v.length >= 3 || "Username must be at least 3 characters",
                                maxLength: (v) => v.length <75 || "Username cannot exceed more than 75 characters",
                                matchPattern: (v) => /^[a-zA-Z0-9- ]+$/.test(v) || "Username must contain only letters, numbers and -",
                                }
                            })} />
                          <small className="invalid-feedback">
                                {errors.userName?.message}
                           </small>
                    </div>
                    <div className="form-group">
                       <label htmlFor="email">Email</label>                       
                        <input type="text" 
                        name="email"
                        className="form-control" 
                        {...register("email", { required: 'Email is mandatory',
                            validate: {
                            maxLength: (v) =>
                            v.length <= 50 || "The email should have at most 50 characters",
                            matchPattern: (v) =>
                            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "Email must be a valid address", }
                           }) }  />   
                         <small className="invalid-feedback">
                                {errors.email?.message}
                           </small>                     
                    </div>
                    <div className="form-group">
                       <label htmlFor="password">Password</label>                       
                        <input type="password" 
                        name="password"
                        className="form-control" 
                        {...register("password", { required: 'Password is mandatory' })} />  
                           <small className="invalid-feedback">
                                {errors.password?.message}
                           </small>                        
                    </div>
                    <div className="form-group">
                       <label htmlFor="confirmPassword">Confirm Password</label>                       
                        <input type="password" 
                        name="confirmPassword"
                        className="form-control" 
                        {...register("confirmPassword", { required: 'Re-enter the Password',
                            validate: (val) => {
                                 if (watch('password') != val) {
                                    return "Your passwords do no match";
                             }} })} />   
                            <small className="invalid-feedback">
                                {errors.confirmPassword?.message}
                           </small>                        
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
                        <div className="text-danger error-text">
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