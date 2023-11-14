import { configureStore } from "@reduxjs/toolkit";
import codepaneReducer from "./slices/codepaneSlice";

export default configureStore({
    reducer: {
        codepaneReducer: codepaneReducer,
    },
});
