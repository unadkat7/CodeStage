import Editor from "@monaco-editor/react";

/**
 * Language map: frontend label → Monaco language ID + Judge0 language string
 */
export const LANGUAGES = [
  { id: "cpp", label: "C++ 17", monacoLang: "cpp", judge0Id: 54 },
  { id: "java", label: "Java 17", monacoLang: "java", judge0Id: 62 },
  { id: "python", label: "Python 3", monacoLang: "python", judge0Id: 71 },
  { id: "javascript", label: "JavaScript", monacoLang: "javascript", judge0Id: 63 },
  { id: "c", label: "C", monacoLang: "c", judge0Id: 50 },
];

/**
 * Default starter code templates per language
 */
export const STARTER_CODE = {
  cpp: `#include <bits/stdc++.h>
using namespace std;

int main() {
    ios_base::sync_with_stdio(false);
    cin.tie(NULL);
    
    // Your code here
    
    return 0;
}`,
  java: `import java.util.*;
import java.io.*;

public class Solution {
    public static void main(String[] args) throws IOException {
        Scanner sc = new Scanner(System.in);
        
        // Your code here
    }
}`,
  python: `import sys
input = sys.stdin.readline

def main():
    # Your code here
    pass

if __name__ == "__main__":
    main()`,
  javascript: `const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

const lines = [];
rl.on('line', (line) => lines.push(line.trim()));
rl.on('close', () => {
    // Your code here using lines[]
});`,
  c: `#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    // Your code here
    
    return 0;
}`,
};

/**
 * CodeEditor — Monaco-based editor with language-synced highlighting.
 *
 * Props:
 *   code        (string)  — current code value
 *   setCode     (fn)      — setter for code
 *   language    (string)  — currently selected language id
 */
function CodeEditor({ code, setCode, language = "cpp" }) {
  // Find the monaco language string for the selected language
  const langDef = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  return (
    <div
      style={{
        borderRadius: "8px",
        overflow: "hidden",
        border: "1px solid var(--color-border)",
      }}
    >
      <Editor
        height="420px"
        language={langDef.monacoLang}
        value={code}
        onChange={(val) => setCode(val || "")}
        theme="vs-dark"
        options={{
          // Font & readability
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontLigatures: true,
          lineHeight: 22,

          // UI
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          lineNumbers: "on",
          glyphMargin: false,
          folding: true,
          automaticLayout: true,

          // Behavior
          tabSize: 4,
          insertSpaces: true,
          wordWrap: "off",
          renderWhitespace: "selection",
          smoothScrolling: true,
          cursorSmoothCaretAnimation: "on",
          bracketPairColorization: { enabled: true },

          // Autocomplete
          suggestOnTriggerCharacters: true,
          acceptSuggestionOnEnter: "on",
          snippetSuggestions: "top",
        }}
      />
    </div>
  );
}

export default CodeEditor;
