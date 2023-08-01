import { createContext, useContext, useEffect,useState  } from 'react';
import axios from 'axios';
const MyContext = createContext();

export function useContextData() {
  return useContext(MyContext);
}

function MyContextProvider({ children }) {
    // Initialize state
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');
    const updateCustomers = (customers) => {
      setCustomers(customers);
      };
      const updateProducts = (products) => {
        
        setProducts(products);
        };
    
    // Fetch data
    useEffect(() => {
      axios.get("customers")  
        .then(function (response) {
          console.log("<><<< "+JSON.stringify(response.data));
          setCustomers(response.data);
        })
        .catch((error) => console.log(error));
        axios.get("products")  
        .then(function (response) {
          console.log("<><<< "+JSON.stringify(response.data));
          setProducts(response.data);
        })
        .catch((error) => console.log(error));
    }, [token]);

    return (
        <MyContext.Provider value={{ customers,products,updateCustomers,updateProducts,setToken}} >
          {children}
        </MyContext.Provider>
      );
    }
    
    export default MyContextProvider;