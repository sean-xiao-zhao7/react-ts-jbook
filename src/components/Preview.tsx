interface PreviewProps {
    loading: boolean;
    iframeRef: any;
    execCode: string;
}

const Preview = ({ loading, iframeRef, execCode }: PreviewProps) => {
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
