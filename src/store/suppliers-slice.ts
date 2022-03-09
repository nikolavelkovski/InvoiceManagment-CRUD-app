import { createSlice } from "@reduxjs/toolkit";

export type suppliers = { suppliers: suppliersOptions[] };

export type suppliersOptions = {
  id?: string;
  name?: string;
  value?: string;
  label?: string;
};

const initialState: suppliers = {
  suppliers: [],
};

const suppliersSlice = createSlice({
  name: "suppliers",
  initialState,
  reducers: {
    replaceSuppliers(state, action) {
      state.suppliers = action.payload;
    },
  },
});

export const suppliersActions = suppliersSlice.actions;
export default suppliersSlice;
