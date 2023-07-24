import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from "../components/navbar";
import '../App.css';
import { useSignOut } from 'react-auth-kit';
import {useAuthUser} from 'react-auth-kit'
const Header = () => {
  const signOut = useSignOut();
  const navigate = useNavigate();
  const auth = useAuthUser()
  const logout= () => {
    signOut();
    navigate("/login");
  }
  return (
         <div className="app-header">
            <div className="header-text">Billing App</div>
            <div className="signout" >
              <div>Hi, {auth()?.id}</div>
              <div onClick={logout}>Sign out</div>
              </div>
        </div>
  );
};

export default Header;