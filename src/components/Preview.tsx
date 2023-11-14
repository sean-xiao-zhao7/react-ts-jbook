import { useCallback, useEffect, useRef, useState } from "react";

// esbuild
import * as esbuild from "esbuild-wasm";
// esbuild plugins
import { unpkgPathPlugin } from "../plugins/unpkg-plugin";
import { fetchPlugin } from "../plugins/fetch-plugins";

interface PreviewProps {
    sourceCode: string;
    loader: string;
}

const Preview = ({ sourceCode, loader }: PreviewProps) => {
    const [loading, setLoading] = useState(false);
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
    );
};

export default Preview;
