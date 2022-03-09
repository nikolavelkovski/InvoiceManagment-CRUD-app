import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import _ from "lodash";
import { IFormInputs } from "../components/CreateEditInvoiceModal";

export type IFormInputsWithId = { id?: string } & IFormInputs;
type invoices = {
  invoices: IFormInputsWithId[];
  filteredInvoices: IFormInputsWithId[];
};

const initialState: invoices = {
  invoices: [],
  filteredInvoices: [],
};

const invoicesSlice = createSlice({
  name: "invoices",
  initialState,
  reducers: {
    replaceInvoices(state, action) {
      state.invoices = action.payload;
    },
    addInvoice: (state, action: PayloadAction<IFormInputs>) => {
      state.invoices.push(action.payload);
    },
    deleteInvoice: (state, action: PayloadAction<string>) => {
      state.invoices = _.filter(
        state.invoices,
        (invoice) => invoice.id !== action.payload
      );
    },
    updateInvoice: (state, action: PayloadAction<IFormInputs>) => {
      const updatedInvoice = _.map(state.invoices, (invoice) =>
        invoice.id === action.payload.id ? action.payload : invoice
      );
      state.invoices = updatedInvoice;
    },
    replaceFilteredInvoices(state, action) {
      state.filteredInvoices = action.payload;
    },
  },
});

export const invoicesActions = invoicesSlice.actions;

export default invoicesSlice;
