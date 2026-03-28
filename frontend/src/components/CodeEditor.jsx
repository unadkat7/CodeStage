import { useState } from "react";
import Editor from "@monaco-editor/react";

/**
 * Language map: frontend label → Monaco language ID + Judge0 language string
 */
export const LANGUAGES = [
  { id: "cpp", label: "C++ 17", monacoLang: "cpp", judge0Id: 54 },
  { id: "java", label: "Java 17", monacoLang: "java", judge0Id: 62 },
  { id: "python", label: "Python 3", monacoLang: "python", judge0Id: 71 },
  {
    id: "javascript",
    label: "JavaScript",
    monacoLang: "javascript",
    judge0Id: 63,
  },
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
 *   height      (string)  — height of the editor (default: 100%)
 */
function CodeEditor({ code, setCode, language = "cpp", height = "100%" }) {
  const [fontSize, setFontSize] = useState(14);
  const [theme, setTheme] = useState("vs-dark");

  // Find the monaco language string for the selected language
  const langDef = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];

  return (
    <div
      style={{
        borderRadius: "10px",
        overflow: "hidden",
        border: "1px solid var(--color-border)",
        background: "var(--color-bg-secondary)",
        height: height,
        display: "flex",
        flexDirection: "column"
      }}
    >
      {/* Editor Settings Toolbar */}
      <div style={{ 
        padding: "6px 12px", 
        borderBottom: "1px solid var(--color-border)", 
        display: "flex", 
        justifyContent: "flex-end", 
        gap: "12px",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
           <span style={{ fontSize: "11px", color: "var(--color-text-muted)" }}>Font</span>
           <select 
             value={fontSize} 
             onChange={(e) => setFontSize(Number(e.target.value))}
             style={{ background: "transparent", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)", borderRadius: "4px", fontSize: "11px", padding: "2px 4px", outline: "none" }}
           >
              {[12, 14, 16, 18, 20].map(s => <option key={s} value={s} style={{ background: "var(--color-bg-secondary)" }}>{s}px</option>)}
           </select>
        </div>
        <button 
          onClick={() => setTheme(theme === "vs-dark" ? "light" : "vs-dark")}
          style={{ background: "none", border: "none", color: "var(--color-text-muted)", cursor: "pointer", display: "flex", alignItems: "center" }}
        >
           {theme === "vs-dark" ? (
             <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
           ) : (
             <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>
           )}
        </button>
      </div>

      <Editor
        height="100%"
        language={langDef.monacoLang}
        value={code}
        onChange={(val) => setCode(val || "")}
        theme={theme}
        options={{
          // Font & readability
          fontSize: fontSize,
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
