import { createContext, useContext, useEffect,useState,useReducer, useRef  } from 'react';
import axios from 'axios';
import reducer,{initialState}from "../reducers/reducer";
const MyContext = createContext(initialState);


export const MyContextProvider = ({ children }) =>{
  const [state, dispatch] = useReducer(reducer, initialState);  
  const isMounted = useRef(false);
    const updateCustomers = (customers) => {
          dispatch({
            type: "ADD_CUSTOMERS",
            payload: {
              customers: customers
            }
          });
      };
      const updateProducts = (products) => {
        dispatch({
          type: "ADD_PRODUCTS",
          payload: {
            products: products
          }
        });
        };
    
    useEffect(() => {
      if (state.token?.length > 0){      
      const cancelToken = axios.CancelToken.source();
      axios.get("customers",{
        cancelToken : cancelToken.token
      })  
        .then(function (response) {
          dispatch({
            type: "ADD_CUSTOMERS",
            payload: {
              customers: response.data
            }
          });
        })
        .catch((error) => {if(axios.isCancel(error)){
          console.log("cancelled");
        } else { console.log(error)}});
        axios.get("products",{
          cancelToken : cancelToken.token
        })  
        .then(function (response) {
          dispatch({
            type: "ADD_PRODUCTS",
            payload: {
              products: response.data
            }
          });
        })
        .catch((error) => {if(axios.isCancel(error)){
          console.log("cancelled");
        } else { console.log(error)}});
        isMounted.current = true;
      }
    }, [state.token]);

    const updateToken = (token) => {
      dispatch({
        type: "UPDATE_TOKEN",
        payload: {
          token: token
        }
      });
    };

    const value = {
      products: state.products,
      customers: state.customers,
      updateProducts,
      updateCustomers,
      updateToken
    };
       return <MyContext.Provider value={value} >{children}</MyContext.Provider>      
    }

    const useContextData = () => {
      const context = useContext(MyContext);    
      if (context === undefined) {
        throw new Error("useContextData must be used within Mycontext provider");
      }    
      return context;
    };
    export default useContextData; 

    