import { useState } from "react";

// esbuild
import ESBuildService from "../../bundler/ESBuildService";

// monaco
import Editor from "@monaco-editor/react";

// components
import Preview from "./Preview";

const CodePane = () => {
    const [sourceCode, setSourceCode] = useState("");
    const [loader, setLoader] = useState("js");
    const [loading, setLoading] = useState(false);
    const [esbuildResult, setEsbuildResult] = useState<any | undefined>();

    const invokeESBuild = async () => {
        setLoading(true);
        const result = await ESBuildService(sourceCode, loader);
        setEsbuildResult(result);
        setLoading(false);
    };

    return (
        <div className="cols-container code-pane">
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
                    onClick={invokeESBuild}
                    className="button button-format is-primary"
                >
                    Transform
                </button>
            </div>
            <Preview loading={loading} esbuildResult={esbuildResult} />
        </div>
    );
};

export default CodePane;
