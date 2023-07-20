import React from "react";
import { useForm } from "react-hook-form";
import '../login.css'
import {Link} from 'react-router-dom';
function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors,isSubmitting },
    } = useForm();
 
    const onSubmit = (data) => {
        
    };
    return (
        <div className="col-md-12">
            <div className="login-card card-container">
                <img
                src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
                alt="profile-img"
                className="profile-img-card"
                />
                <p className="mt-6 text-center text-3xl font-extrabold text-gray-900" >
                    Don't have an account yet? <Link to='/register' className="font-medium text-purple-600 hover:text-purple-500">
                    Signup
                    </Link>
                </p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                         <label htmlFor="username">Username</label>
                         <input type="text"
                         className="form-control"
                         name="username"
                         {...register("username", { required: 'Username is mandatory' })} />
                         
                    </div>
                    <small className="invalid-feedback">
                                {errors.username?.message}
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
            </div>
        </div>
    );
}
export default Login;