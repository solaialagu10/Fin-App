import { Outlet } from 'react-router-dom';
import Navbar from "../components/navbar";
import '../App.css';
const Layout = () => {
  return (
    <div className="layout">
         <div className="app-header">
            <div className="header-text">Billing App</div>
        </div>
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