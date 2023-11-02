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
        let result1 = await esbuild.transform("<Test>Hi</Test>", {
            loader: "jsx",
            target: "es2015",
        });
        console.log(result1.code);
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
