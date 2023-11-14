import React from "react";
import ReactDOM from "react-dom/client";

// redux
import store from "./redux/store";
import { Provider } from "react-redux";

// style
import "./index.css";

// components
import App from "./App";

const root = ReactDOM.createRoot(
    document.getElementById("root") as HTMLElement
);
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>
);
