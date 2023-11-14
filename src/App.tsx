import { useCallback, useEffect, useState } from "react";

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
    const [esbuildResult, setEsbuildResult] = useState();

    const transform = async () => {
        setLoading(true);
        let result1 = await esbuild.build({
            entryPoints: [`index.${loader}`],
            bundle: true,
            write: false,
            plugins: [unpkgPathPlugin(), fetchPlugin(sourceCode)],
            outfile: "out.js",
        });
        setEsbuildResult(result1);

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

        setLoading(false);
    };

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
            <Preview loading={loading} esbuildResult={esbuildResult} />
        </div>
    );
};

export default App;
