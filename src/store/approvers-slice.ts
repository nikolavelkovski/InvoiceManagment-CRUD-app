import { createSlice } from "@reduxjs/toolkit";

type approvers = { approvers: approversOptions[] };
export type approversOptions = {
  id?: string;
  name?: string;
  imgUrl?: string;
  value?: string;
  label?: string;
  customAbbreviation?: string;
};

const initialState: approvers = {
  approvers: [],
};

const approversSlice = createSlice({
  name: "approvers",
  initialState,
  reducers: {
    replaceApprovers(state, action) {
      state.approvers = action.payload;
    },
  },
});

export const approversActions = approversSlice.actions;

export default approversSlice;
