import * as esbuild from "esbuild-wasm";
import { useCallback, useEffect } from "react";

import logo from "./logo.svg";
import "./App.css";

const App = () => {
    const initESBW = useCallback(async () => {
        try {
            await esbuild.initialize({
                wasmURL: "/esbuild.wasm",
            });
        } catch (err: any) {
            console.log(err.message);
        }
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
                <p>ESBuild Test.</p>
                <button onClick={transform}>Transform</button>
            </header>
        </div>
    );
};

export default App;
