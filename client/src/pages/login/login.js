import React, { useState}  from "react";
import {  useNavigate  } from 'react-router-dom';
import { useForm } from "react-hook-form";
import '../login.css'
import {Link} from 'react-router-dom';
import { useSignIn } from "react-auth-kit";
import axios, { AxiosError } from "axios";
import  useContextData  from "../../context/Mycontext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
const eye = <FontAwesomeIcon icon={faEye} />;
const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} />;
function Login() {
    const {updateToken} =useContextData();     
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePasswordVisiblity = () => {
      setPasswordShown(passwordShown ? false : true);
    };
    let navigate = useNavigate();
    const signIn = useSignIn();
    const [error,setError]=useState('')
    const {
        register,
        handleSubmit,
        formState: { errors,isSubmitting },
    } = useForm();
 
 

    const onSubmit =  async (data) => { 
        const settings = {
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          };
          try {
            
            const response =  await axios.post("login", data)
            updateToken(response.data.token);
                signIn({
                    token: response.data.token,
                    expiresIn: 3600,
                    tokenType: "Bearer",
                    authState: {id : data.userName}
                });    
                axios.defaults.headers.common['Authorization']=`bearer ${response.data.token}`
                navigate('/dashboard');    
            } catch (e) {        
            //   setTimeout(() => {
                if(e.response !== undefined)
                     setError(e.response.data.message)
                else
                      setError("Network Error")
            //   }, 1000);
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
                {isSubmitting && (
                                <span className="spinner-border spinner-border-sm spinner-class"></span>
                            )}
                    <div className="form-group">
                         <label htmlFor="userName">Username</label>
                         <input type="text"
                         className="form-control"
                         name="userName"
                         {...register("userName", { required: 'Username is mandatory' })} />
                         
                    </div>
                    <small className="invalid-feedback">
                                {errors.userName?.message}
                           </small>
                          
                    <div className="form-group">
                       <label htmlFor="password">Password</label>   
                       <div className="pass-wrapper">                  
                       {" "}
                        <input  type={passwordShown ? "text" : "password"}
                        name="password"
                        className="form-control" 
                        {...register("password",{ required: 'Password is mandatory' })} /> 
                         <i  className="pass-icon"  onClick={togglePasswordVisiblity}>{passwordShown ? eyeSlash : eye}</i>{" "}            
                         </div>          
                    </div>
                    <small className="invalid-feedback">
                                {errors.password?.message}
                           </small>                       

                    <div className="form-group">
                            <input type="submit" value="Login" className="btn btn-primary btn-block" disabled={isSubmitting} />                             
                           
                    </div>
                </form>
                <p className="message" >
                    Don't have an account yet? &nbsp;&nbsp;&nbsp; <Link to='/register' className="font-medium text-purple-600 hover:text-purple-500">
                    Signup here
                    </Link>
                </p>
                {error && 
                        <div className="text-danger error-text">
                            {error}
                        </div>
                     }
            </div>
        </div>
    );
}
export default Login;