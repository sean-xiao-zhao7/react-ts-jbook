import * as esbuild from "esbuild-wasm";
import { useCallback, useEffect, useState } from "react";

import "./App.css";

const App = () => {
    const [loading, setLoading] = useState(false);
    const [transformedCode, setTransformedCode] = useState("");

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
        setLoading(true);
        let result1 = await esbuild.transform("<Test>Hi</Test>", {
            loader: "jsx",
            target: "es2015",
        });
        setTransformedCode(result1.code);
        setLoading(false);
    };

    useEffect(() => {
        initESBW();
    }, [initESBW]);

    return (
        <>
            <header className="App-header">
                <div className="col">
                    <h4>Enter code</h4>
                    <textarea></textarea>
                </div>
                <div className="col">
                    <button onClick={transform}>Transform</button>
                    {loading && <h4>Transforming</h4>}
                    {transformedCode && <pre>{transformedCode}</pre>}
                </div>
            </header>
        </>
    );
};

export default App;
