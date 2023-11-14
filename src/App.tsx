import { useCallback, useEffect, useRef, useState } from "react";

// esbuild
import * as esbuild from "esbuild-wasm";
// esbuild plugins
import { unpkgPathPlugin } from "./plugins/unpkg-plugin";
import { fetchPlugin } from "./plugins/fetch-plugins";

// monaco
import Editor from "@monaco-editor/react";

// CSS
import "../node_modules/bulmaswatch/superhero/bulmaswatch.min.css";
import "./App.css";

// components
import Preview from "./components/Preview";

const App = () => {
    const [sourceCode, setSourceCode] = useState("");
    const [loader, setLoader] = useState("js");
    const [loading, setLoading] = useState(false);

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
                    theme="vs-dark"
                    options={{
                        wordWrap: "on",
                        minimap: { enabled: false },
                        showUnused: false,
                        folding: false,
                        lineNumbersMinChars: 3,
                        fontSize: 16,
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                    }}
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
                <button
                    onClick={transform}
                    className="button button-format is-primary"
                >
                    Transform
                </button>
            </div>
            <Preview
                loading={loading}
                iframeRef={iframeRef}
                execCode={execCode}
            />
        </div>
    );
};

export default App;
