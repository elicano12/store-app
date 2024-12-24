import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slices/productSlice";
import cartReducer from "./slices/cartSlice";
import transactionReducer from "./slices/transactionsSlice";

const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    transaction: transactionReducer,
  },
});

export default store;
