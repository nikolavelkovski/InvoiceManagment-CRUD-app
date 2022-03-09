import { Dispatch } from "react";
import { approversActions } from "./approvers-slice";
import { fetchData } from "./utils";

export const fetchApproversData = () => {
  return async (dispatch: Dispatch<any>) => {
    try {
      const approversData = await fetchData("approvers");
      dispatch(approversActions.replaceApprovers(approversData));
    } catch (error) {
      console.log(error);
    }
  };
};
