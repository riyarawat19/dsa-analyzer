import Editor from "@monaco-editor/react";
import { useEffect } from "react";

const templates = {
  cpp: `#include<bits/stdc++.h>
using namespace std;

int main() {

    return 0;
}
`,

  python: `def solve():
    pass

solve()
`,

  java: `import java.util.*;

public class Main {
    public static void main(String[] args) {

    }
}
`,
};

export default function CodeEditor({
  code,
  setCode,
  language,
}) {
  useEffect(() => {
    if (!code.trim()) {
      setCode(templates[language]);
    }
  }, [language]);

  const handleEditorDidMount = (editor, monaco) => {
    editor.addCommand(
      monaco.KeyMod.CtrlCmd |
        monaco.KeyCode.Enter,
      () => {
        console.log("Run Analyze");
      }
    );
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10">
      <Editor
        height="600px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 15,
          minimap: {
            enabled: false,
          },

          smoothScrolling: true,
          padding: {
            top: 20,
          },

          scrollBeyondLastLine: false,

          automaticLayout: true,

          wordWrap: "on",

          tabSize: 2,

          cursorSmoothCaretAnimation: "on",

          suggestOnTriggerCharacters: true,

          formatOnPaste: true,
          formatOnType: true,

          quickSuggestions: true,

          bracketPairColorization: {
            enabled: true,
          },

          guides: {
            bracketPairs: true,
          },
        }}
      />
    </div>
  );
}