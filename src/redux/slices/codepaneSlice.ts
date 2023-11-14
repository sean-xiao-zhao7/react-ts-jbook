import { createSlice } from "@reduxjs/toolkit";

interface codepaneState {
    panes: any[];
    error: string;
}

export const codepaneSlice = createSlice({
    name: "codepane",
    initialState: <codepaneState>{
        panes: [],
        error: "",
    },
    reducers: {
        addPane: (state) => {},
        removePane: (state) => {},
        addBundle: (state, action) => {},
    },
});

export const { addPane, removePane, addBundle } = codepaneSlice.actions;
export default codepaneSlice.reducer;
