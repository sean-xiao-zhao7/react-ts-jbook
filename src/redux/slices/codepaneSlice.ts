import { createSlice } from "@reduxjs/toolkit";

export const codepaneSlice = createSlice({
    name: "codepane",
    initialState: {
        panes: [],
    },
    reducers: {
        addPane: (state) => {},
        removePane: (state) => {},
        addBundle: (state, action) => {},
    },
});

export const { addPane, removePane, addBundle } = codepaneSlice.actions;
export default codepaneSlice.reducer;
