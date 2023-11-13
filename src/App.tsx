import * as esbuild from "esbuild-wasm";
import { useCallback, useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";

import "./App.css";
import { unpkgPathPlugin } from "./plugins/unpkg-plugin";
import { fetchPlugin } from "./plugins/fetch-plugins";

const App = () => {
    const [loading, setLoading] = useState(false);
    const [sourceCode, setSourceCode] = useState("");
    const [loader, setLoader] = useState("js");
    const iframeRef = useRef<any>();

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

        // if (result1.outputFiles.length > 1) {
        //     let combinedText = "";
        //     for (const outputFile of result1.outputFiles) {
        //         combinedText += "----\n";
        //         combinedText += outputFile.text;
        //     }
        //     setTransformedCode(combinedText);
        // } else {
        //     setTransformedCode(result1.outputFiles[0].text);
        // }
        iframeRef.current.srcdoc = execCode;
        iframeRef.current.contentWindow.postMessage(
            result1.outputFiles[0].text,
            "*"
        );

        setLoading(false);
    };

    useEffect(() => {
        initESBW();
    }, [initESBW]);

    const execCode = `
    <html>
        <head></head>
        <body>
            <div id="root"></div>
            <script>
                window.addEventListener('message', (event) => {
                    try {
                        eval(event.data)
                    } catch (err) {                        
                        const root = document.querySelector('#root');                        
                        root.innerHTML = '<p style="color: red;">' + err + '.</p>';
                        console.error(err);
                    }
                }, false);
            </script>
        </body>
    </html>
    `;

    return (
        <div className="cols-container">
            <div className="col">
                <h4>Enter code</h4>
                <Editor
                    height="40vh"
                    defaultLanguage="javascript"
                    defaultValue=""
                    onChange={(value, event) =>
                        setSourceCode(value ? value : "")
                    }
                />
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
            <div className="col" style={{ backgroundColor: "white" }}>
                {loading && <h4>Transforming</h4>}
                <iframe
                    ref={iframeRef}
                    srcDoc={execCode}
                    sandbox="allow-scripts"
                    id="codeIframe"
                    title="codeIframe"
                ></iframe>
            </div>
        </div>
    );
};

export default App;
