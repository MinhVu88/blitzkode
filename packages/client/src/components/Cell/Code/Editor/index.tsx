import React, { useRef } from "react";
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import codeShift from "jscodeshift";
import Highlighter from "monaco-jsx-highlighter";
import "./editor.css";
import "./syntax.css";

interface CodeEditorProps {
	initialValue: string;
	onChange(value: string): void;
}

export const Editor: React.FC<CodeEditorProps> = ({ initialValue, onChange }) => {
	const monacoEditorRef = useRef<any>();

	// this function's called when the code editor's 1st displayed on the screen
	const handleEditorDidMount: EditorDidMount = (getCurrentUserInput, monacoEditor) => {
		monacoEditorRef.current = monacoEditor;

		monacoEditor.onDidChangeModelContent(() => {
			console.log(
				"\nCodeCell editor | handleEditorDidMount() | getCurrentUserInput() ->",
				getCurrentUserInput()
			);

			onChange(getCurrentUserInput());
		});

		monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

		const syntaxHighlighter = new Highlighter(
			// @ts-ignore
			window.monaco,
			codeShift,
			monacoEditor
		);

		syntaxHighlighter.highLightOnDidChangeModelContent(
			() => {},
			() => {},
			undefined,
			() => {}
		);
	};

	const formatCode = () => {
		console.log(
			"\nCodeCell editor | formatCode() | monacoEditorRef.current ->",
			monacoEditorRef.current
		);

		// get the current, unformatted user-provided code
		const unformattedUserInput = monacoEditorRef.current.getModel().getValue();

		// use prettier to format user's unformatted code
		const formattedUserInput = prettier
			.format(unformattedUserInput, {
				parser: "babel",
				plugins: [parser],
				useTabs: true,
				semi: true,
				singleQuote: true
			})
			.replace(/\n$/, "");

		// set the formatted user-provided code back in the editor
		monacoEditorRef.current.setValue(formattedUserInput);
	};

	return (
		<div className="editor-wrapper">
			<button 
				onClick={formatCode} 
				className="button button-format is-primary is-small"
			>
				Format
			</button>
			<MonacoEditor
				value={initialValue}
				height="100%"
				language="javascript"
				theme="dark"
				editorDidMount={handleEditorDidMount}
				options={{
					wordWrap: "on",
					minimap: { enabled: false },
					showUnused: false,
					folding: false,
					lineNumbersMinChars: 3,
					fontSize: 16,
					scrollBeyondLastLine: false,
					automaticLayout: true
				}}
			/>
		</div>
	);
};
