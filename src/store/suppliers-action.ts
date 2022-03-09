import { Dispatch } from "react";
import { fetchData } from "./utils";
import { suppliersActions } from "./suppliers-slice";

export const fetchSuppliersData = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const suppliersData = await fetchData("suppliers");
      dispatch(suppliersActions.replaceSuppliers(suppliersData));
    } catch (error) {
      console.log(error);
    }
  };
};
