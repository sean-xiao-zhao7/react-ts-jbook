import { useEffect, useRef } from "react";

interface PreviewProps {
    esbuildResult: any;
    loading: boolean;
}

const Preview = ({ esbuildResult, loading }: PreviewProps) => {
    const iframeRef = useRef<any>();

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

    useEffect(() => {
        if (esbuildResult) {
            iframeRef.current.srcdoc = execCode;
            iframeRef.current.contentWindow.postMessage(
                esbuildResult.outputFiles[0].text,
                "*"
            );
        }
    }, [esbuildResult, execCode]);

    return (
        <div className="col">
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
