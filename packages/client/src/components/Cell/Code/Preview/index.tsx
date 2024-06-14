import React, { useRef, useEffect } from "react";
import "./preview.css";

interface CodePreviewProps {
	bundledCode: string;
	status: string;
}

const iframeOriginalContents = `
    <html>
      <head></head>
      <body>
        <div id="root"></div>
        <script>
          const handleError = error => {
            const root = document.querySelector('#root');

            root.innerHTML = '<div style="color: red;"><h4>Runtime Error: </h4>' + error + '</div>';

            console.error("CodeCell preview | iframeOriginalContents | handleError | error ->",error);
          };

          window.addEventListener('error', event => {
            event.preventDefault();

            console.log("CodeCell preview | iframeOriginalContents | window.addEventListener('error') | event ->",event);

            const asyncError = event.error;

            handleError(asyncError);
          });

          // listen for the "message" event from the parent frame (user input in CodeEditor)
          window.addEventListener(
            'message',
            event => {
              try{
                const transpiredBundledOutput = event.data;

                console.log("CodeCell preview | iframeOriginalContents | window.addEventListener('message') | event.data ->", transpiredBundledOutput);
              
                eval(transpiredBundledOutput);
              }catch(error) {
                handleError(error);
              }
            },
            false
          );
        </script>
      </body>
    </html>
  `;

export const Preview: React.FC<CodePreviewProps> = ({ bundledCode, status }) => {
	const iframeRef = useRef<any>();

	useEffect(() => {
		iframeRef.current.srcdoc = iframeOriginalContents;

		setTimeout(() => {
			iframeRef.current.contentWindow.postMessage(bundledCode, "*");

			console.log("\nCodeCell preview | useEffect | iframeRef.current ->", iframeRef.current);
		}, 50);
	}, [bundledCode]);

	return (
		<div className="preview-wrapper">
			<iframe
				title="codePreview"
				sandbox="allow-scripts"
				srcDoc={iframeOriginalContents}
				ref={iframeRef}
			/>
			{status && <div className="preview-error">{status}</div>}
		</div>
	);
};
