import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import productReducer from "./slices/productSlice";
import userReducer from "./slices/userSlice";
import wishlistSlice from "./slices/wishlistSlice";
import buyNowReducer from "./slices/buyNowSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    product: productReducer,
    user: userReducer,
    Wishlist: wishlistSlice,
    buyNow: buyNowReducer, // <-- add this line
  },
});
