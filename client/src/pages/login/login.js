import React, { useState,useEffect}  from "react";
import { Navigate, useNavigate  } from 'react-router-dom';
import { useForm } from "react-hook-form";
import '../login.css'
import {Link} from 'react-router-dom';
import { useSignIn } from "react-auth-kit";
function Login() {
    let navigate = useNavigate();
    const signIn = useSignIn();
    const [error,setError]=useState('')
    const {
        register,
        handleSubmit,
        formState: { errors,isSubmitting },
    } = useForm();
 
    const onSubmit =  async (data) => { 
        console.log("<><><><> "+JSON.stringify(data));
        const settings = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          };
          try {
            const response =  await fetch("http://localhost:5000/login", settings)
            const res = await response.json();
                signIn({
                    token: res.token,
                    expiresIn: 3600,
                    tokenType: "Bearer",
                    authState: {userName : data.userName}
                });    
                navigate('/dashboard');    
            } catch (e) {        
              console.log("<><<>< error"+e);
              setError(e.response?.data.message)
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
                <h3 className="message">Welcome Back</h3>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                         <label htmlFor="userName">Email or Username</label>
                         <input type="text"
                         className="form-control"
                         name="userName"
                         {...register("userName", { required: 'Email or username is mandatory' })} />
                         
                    </div>
                    <small className="invalid-feedback">
                                {errors.userName?.message}
                           </small>
                    <div className="form-group">
                       <label htmlFor="password">Password</label>                       
                        <input type="password" 
                        name="password"
                        className="form-control" 
                        {...register("password",{ required: 'Password is mandatory' })} />                     
                    </div>
                    <small className="invalid-feedback">
                                {errors.password?.message}
                           </small>    
                    <div className="form-group">
                            <input type="submit" value="Login" className="btn btn-primary btn-block" disabled={isSubmitting} /> 
                            {isSubmitting && (
                                <span className="spinner-border spinner-border-sm"></span>
                            )}
                           
                    </div>
                </form>
                <p className="message" >
                    Don't have an account yet? &nbsp;&nbsp;&nbsp; <Link to='/register' className="font-medium text-purple-600 hover:text-purple-500">
                    Signup here
                    </Link>
                </p>
            </div>
        </div>
    );
}
export default Login;