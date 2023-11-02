import { useEffect, useState } from "react";
import * as esbuild from "esbuild-wasm";

import logo from "./logo.svg";
import "./App.css";

const App = () => {
    useEffect(() => {
        startService();
    }, []);

    const startService = async () => {
        const result = await esbuild.initialize({
            wasmURL: "./node_modules/esbuild-wasm/esbuild.wasm",
            worker: false,
        });
        return result;
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
};

export default App;
