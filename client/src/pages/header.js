import {  useNavigate } from 'react-router-dom';
import '../App.css';
import { useSignOut } from 'react-auth-kit';
import {useAuthUser} from 'react-auth-kit';
import { useContextData } from "../context/Mycontext";
const Header = () => {
  const {customers,updateCustomers} =useContextData();
  const signOut = useSignOut();
  const navigate = useNavigate();
  const auth = useAuthUser()
  const logout= () => {
    updateCustomers([]);
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