import * as esbuild from "esbuild-wasm";
import { useCallback, useEffect } from "react";

import logo from "./logo.svg";
import "./App.css";

const App = () => {
    const initESBW = useCallback(async () => {
        await esbuild.initialize({
            wasmURL: "/esbuild.wasm",
        });
        transform();
    }, []);

    const transform = async () => {
        let result1 = await esbuild.transform("let test: boolean = true", {
            loader: "ts",
        });
        console.log(result1);
    };

    useEffect(() => {
        initESBW();
    }, [initESBW]);

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
