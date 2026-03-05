import Editor from "@monaco-editor/react";

function CodeEditor({ code, setCode }) {
  return (
    <Editor
      height="400px"
      defaultLanguage="javascript"
      value={code}
      onChange={(value) => setCode(value)}
      theme="vs-dark"
    />
  );
}

export default CodeEditor;
