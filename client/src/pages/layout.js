import { Outlet } from 'react-router-dom';
import Navbar from "../common/navbar";
import Header from "./header";
import '../App.css';

const Layout = () => { 
  return (
    <div className="layout container-fluid">         
          <header className="header">
               <Header />
          </header>
          <main class="main-content">
                <Outlet />
            </main>
            <section class="left-sidebar">
                <Navbar />
            </section>
           
    </div>
  );
};

export default Layout;