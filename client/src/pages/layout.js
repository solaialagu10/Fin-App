import { Outlet } from 'react-router-dom';
import Navbar from "../components/navbar";
import Header from "./header";
import '../App.css';

const Layout = () => { 
  return (
    <div className="layout">
         <Header />
        <div className="app-container">
            <div className="div-left">
                <Navbar />
            </div>
            <div className="div-right">
                <Outlet />
            </div>
        </div>
    </div>
  );
};

export default Layout;