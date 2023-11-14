import { createSlice } from "@reduxjs/toolkit";

export const codepaneSlice = createSlice({
    name: "codepane",
    initialState: {
        panes: [],
    },
    reducers: {
        addPane: (state) => {},
    },
});

export const { addPane } = codepaneSlice.actions;
export default codepaneSlice.reducer;
