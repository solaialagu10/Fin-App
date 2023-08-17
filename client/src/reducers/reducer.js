export const initialState = {
   customers: [],
   products:[],
   token:''
 };
 
 const reducer = (state, action) => {
   const { type, payload } = action;
 
   switch (type) {
     case "ADD_PRODUCTS":
       console.log("products ", payload);
 
       return {
         ...state,
         products: payload.products
       };
     case "ADD_CUSTOMERS":
       console.log("customers ", payload);
 
       return {
         ...state,
         customers: payload.customers
       };     
      case "UPDATE_TOKEN":
        console.log("token ", payload);
        return {
          ...state,
          token: payload.token
        };     
     default:
       throw new Error(`No case for type ${type} found in invoiceReducer.`);
   }
 };
 
 export default reducer;
 