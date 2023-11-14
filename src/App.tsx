import { useState } from "react";
import Editor from "@monaco-editor/react";

// CSS
import "../node_modules/bulmaswatch/superhero/bulmaswatch.min.css";
import "./App.css";

// components
import Preview from "./components/Preview";

const App = () => {
    const [sourceCode, setSourceCode] = useState("");
    const [loader, setLoader] = useState("js");

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
            <Preview loader={loader} sourceCode={sourceCode} />
        </div>
    );
};

export default App;
