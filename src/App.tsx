import * as esbuild from "esbuild-wasm";
import { useCallback, useEffect, useState } from "react";

import "./App.css";
import { unpkgPathPlugin } from "./plugins/unpkg-plugin";
import { fetchPlugin } from "./plugins/fetch-plugins";

const App = () => {
    const [loading, setLoading] = useState(false);
    const [sourceCode, setSourceCode] = useState("");
    const [transformedCode, setTransformedCode] = useState("");
    const [loader, setLoader] = useState("js");

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
        let result1 = await esbuild.build({
            entryPoints: [`index.${loader}`],
            bundle: true,
            write: false,
            plugins: [unpkgPathPlugin(), fetchPlugin(sourceCode)],
            outfile: "out.js",
        });

        if (result1.outputFiles.length > 1) {
            let combinedText = "";
            for (const outputFile of result1.outputFiles) {
                combinedText += "----\n";
                combinedText += outputFile.text;
            }
            setTransformedCode(combinedText);
        } else {
            setTransformedCode(result1.outputFiles[0].text);
        }

        setLoading(false);
    };

    useEffect(() => {
        initESBW();
    }, [initESBW]);

    const execCode = `
    <script>
        ${transformedCode}
    </script>
    `;

    return (
        <div className="cols-container">
            <div className="col">
                <h4>Enter code</h4>
                <textarea
                    onChange={(event) => setSourceCode(event.target.value)}
                ></textarea>
                <div>
                    Type:
                    <select
                        onChange={(event) => {
                            setLoader(event.target.value);
                        }}
                    >
                        <option value="js">JavaScript</option>
                        <option value="css">CSS</option>
                    </select>
                </div>
                <button onClick={transform}>Transform</button>
            </div>
            <div className="col">
                {loading && <h4>Transforming</h4>}
                {transformedCode && <pre>{transformedCode}</pre>}
                <iframe
                    srcDoc={execCode}
                    sandbox="allow-scripts"
                    id="codeIframe"
                ></iframe>
            </div>
        </div>
    );
};

export default App;
