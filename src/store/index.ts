import { configureStore } from "@reduxjs/toolkit";
import approversSlice from "./approvers-slice";
import invoicesSlice from "./invoices-slice";
import suppliersSlice from "./suppliers-slice";

const store = configureStore({
  reducer: {
    invoices: invoicesSlice.reducer,
    approvers: approversSlice.reducer,
    suppliers: suppliersSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
