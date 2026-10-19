import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WineModel } from "../models/wine";

const shoppingSlice = createSlice({
  name: 'shoppingSlice',
  initialState: { shoppingCart: [] as WineModel[] },
  reducers: {
    addToCart: (state, action: PayloadAction<WineModel>) => {
      state.shoppingCart.push(action.payload);
    },
    removeFromCart: (state, action: PayloadAction<number>) => {
      state.shoppingCart = state.shoppingCart.filter(item => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.shoppingCart = [];
    }
  },
});

export const { addToCart, removeFromCart, clearCart } = shoppingSlice.actions;
export default shoppingSlice.reducer;
