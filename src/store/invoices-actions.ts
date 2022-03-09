import { invoicesActions } from "./invoices-slice";
import { Dispatch } from "react";
import { fetchData } from "./utils";
import { IFormInputs } from "../components/CreateEditInvoiceModal";

export const fetchInvoicesData = (filter: string = "") => {
  return async (dispatch: Dispatch<any>) => {
    try {
      if (filter) {
        const invoiceDataFiltered = await fetchData("invoices", filter);
        dispatch(invoicesActions.replaceFilteredInvoices(invoiceDataFiltered));
      } else {
        const invoicesData = await fetchData("invoices");
        dispatch(invoicesActions.replaceInvoices(invoicesData));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

export const deleteInvoice = (id: string) => {
  return async (dispatch: Dispatch<any>) => {
    const response = await fetch(`http://localhost:3001/invoices/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Could not delete invoice!");
    }

    try {
      dispatch(invoicesActions.deleteInvoice(id));
    } catch (error) {
      console.log(error);
    }
  };
};

export const createNewInvoice = (invoice: IFormInputs) => {
  console.log(invoice);
  return async (dispatch: Dispatch<any>) => {
    const response = await fetch(`http://localhost:3001/invoices`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        //JSON.STRINGIFY(INVOICE) will update the database in wrong column order and case problems
        id: invoice.id,
        invoice_date: invoice.invoice_date,
        supplier: invoice.supplier,
        due_date: invoice.due_date,
        invoice_number: invoice.invoice_number,
        total: invoice.total,
        currency: invoice.currency,
        approver: invoice.approver,
        status: invoice.status,
      }),
    });
    if (!response.ok) {
      throw new Error("Could not add new invoice");
    }
    try {
      const Invoicedata = await response.json();
      dispatch(invoicesActions.addInvoice(Invoicedata));
    } catch (error) {
      console.log(error);
    }
  };
};

export const updateInvoice = (invoiceData: IFormInputs, id: string) => {
  return async (dispatch: Dispatch<any>) => {
    const response = await fetch(`http://localhost:3001/invoices/${id}`, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(invoiceData),
    });
    if (!response.ok) {
      throw new Error("Could not delete invoice!");
    }

    try {
      const invoiceDataWithId = { ...invoiceData, id };
      dispatch(invoicesActions.updateInvoice(invoiceDataWithId));
    } catch (error) {
      console.log(error);
    }
  };
};
