import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import './index.css'
import { BrowserRouter } from "react-router-dom";
import {AuthProvider} from 'react-auth-kit';
import MyContextProvider from "./context/Mycontext";
import './interceptors/axios';
const root = ReactDOM.createRoot(
  document.getElementById("root")
);
root.render(
  <React.StrictMode>
     <AuthProvider authType = {'cookie'}
                  authName={'_auth'}
                  cookieDomain={window.location.hostname}
                  cookieSecure={false}>       
          <BrowserRouter>
           <MyContextProvider>
              <App />
            </MyContextProvider>
          </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
  
);