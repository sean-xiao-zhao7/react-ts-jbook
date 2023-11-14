import { useEffect, useRef } from "react";

interface PreviewProps {
    esbuildResult: any;
    loading: boolean;
}

const Preview = ({ esbuildResult, loading }: PreviewProps) => {
    const iframeRef = useRef<any>();

    const execCode = `
    <html>
        <head>
            <title>Code Pane</title>
            <style>
                body {
                    color: white;
                    background-color: #444f66;
                    padding: 1rem;
                }
            </style>
        </head>
        <body>
            <div id="root"></div>
            <script>                                
                window.addEventListener('message', (event) => {
                    const root = document.querySelector('#root'); 
                    try {
                        eval(event.data)
                        root.innerHTML = event.data;
                    } catch (err) {                        
                        root.innerHTML = err + '.';
                        console.error(err);
                    }
                }, false);
            </script>
        </body>
    </html>
    `;

    useEffect(() => {
        if (esbuildResult) {
            iframeRef.current.contentWindow.postMessage(
                esbuildResult.outputFiles[0].text,
                "*"
            );
        }
    }, [esbuildResult, execCode]);

    return (
        <div className="col preview">
            {loading && <h1>Bundling...</h1>}
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
