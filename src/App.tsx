import { useEffect, useState, useCallback } from "react";
import "./App.css";

interface Option {
  label: string;
  value:
    | "collapseWhitespace"
    | "custom"
    | "dedupe"
    | "delSpace"
    | "removeBlank"
    | "reverse"
    | "stripListPrefix"
    | "stripQuotes"
    | "trim";
  code: string;
}

const githubUrl = "https://github.com/7revor/excel-tools";
const commonSplit = `input.split(/\\r?\\n/)`;
const commonJoin = `.join("\\n")`;

const options: Option[] = [
  { label: "去空格", value: "delSpace", code: ".map(item => item.replace(/\\s/g, ''))" },
  { label: "去首尾空格", value: "trim", code: ".map(item => item.trim())" },
  { label: "去空行", value: "removeBlank", code: ".filter(item => item.trim() !== '')" },
  { label: "合并空白", value: "collapseWhitespace", code: ".map(item => item.replace(/\\s+/g, ' ').trim())" },
  { label: "去序号/符号", value: "stripListPrefix", code: ".map(item => item.replace(/^\\s*(?:[-•*]|\\d+[.)、])\\s*/, ''))" },
  { label: "去引号", value: "stripQuotes", code: ".map(item => item.replace(/^[\"']|[\"']$/g, ''))" },
  { label: "去重", value: "dedupe", code: ".filter((item, index, arr) => arr.indexOf(item) === index)" },
  { label: "取反", value: "reverse", code: ".map(item => isNaN(item) ? item : Number(item) * -1)" },
  { label: "自定义", value: "custom", code: ".map(item => item)" },
];

interface Toast {
  id: number;
  type: "success" | "error";
  text: string;
}

const App = () => {
  const [input, setInput] = useState("");
  const [opt, setOpt] = useState<Option["value"]>("delSpace");
  const [customCode, setCustomCode] = useState("");
  const [result, setResult] = useState("");
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: Toast["type"], text: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, type, text }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  useEffect(() => {
    const optCode = options.find((item) => item.value === opt)?.code;
    if (optCode) {
      setCustomCode(commonSplit + optCode + commonJoin);
    }
  }, [opt]);

  const onGenerate = () => {
    if (!customCode) return showToast("error", "请选择操作或输入自定义代码");
    if (!input) return showToast("error", "请输入内容");
    try {
      // eslint-disable-next-line react-hooks/unsupported-syntax
      const str = eval(customCode);
      setResult(str);
      navigator.clipboard.writeText(str).catch(() => {});
      showToast("success", "结果已复制到剪切板");
    } catch (error) {
      setResult("");
      showToast("error", `代码错误: ${error instanceof Error ? error.message : "未知错误"}`);
    }
  };

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).catch(() => {});
    showToast("success", "已复制");
  };

  const lineCount = input ? input.split("\n").length : 0;
  const resultLineCount = result ? result.split("\n").length : 0;

  return (
    <div className="app">
      {/* Background gradient blobs */}
      <div className="bg-blob bg-blob-1" />
      <div className="bg-blob bg-blob-2" />

      {/* Toast notifications */}
      <div className="toast-stack">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-dot" />
            {t.text}
          </div>
        ))}
      </div>

      {/* Header */}
      <header className="header">
        <div className="brand">
          <div className="brand-icon">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 1.5L16.5 5.625V12.375L9 16.5L1.5 12.375V5.625L9 1.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M1.5 5.625L9 9.75L16.5 5.625" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
              <path d="M9 9.75V16.5" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </div>
          <h1 className="brand-name">Excel Tools</h1>
          <span className="brand-tag">文本处理</span>
        </div>
        <a className="github-btn" href={githubUrl} target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor">
            <path d="M12 2C6.477 2 2 6.589 2 12.253c0 4.53 2.865 8.374 6.839 9.73.5.095.682-.221.682-.492 0-.244-.009-.89-.014-1.747-2.782.617-3.369-1.37-3.369-1.37-.455-1.183-1.11-1.498-1.11-1.498-.908-.636.069-.623.069-.623 1.004.072 1.532 1.054 1.532 1.054.892 1.57 2.341 1.116 2.91.854.091-.664.349-1.116.635-1.373-2.221-.259-4.555-1.138-4.555-5.063 0-1.119.389-2.034 1.029-2.752-.103-.259-.446-1.302.098-2.714 0 0 .84-.276 2.75 1.051A9.35 9.35 0 0 1 12 6.836a9.31 9.31 0 0 1 2.504.347c1.909-1.327 2.748-1.051 2.748-1.051.546 1.412.203 2.455.1 2.714.64.718 1.028 1.633 1.028 2.752 0 3.935-2.338 4.801-4.566 5.055.359.319.679.948.679 1.91 0 1.379-.012 2.49-.012 2.829 0 .273.18.592.688.491C19.138 20.624 22 16.781 22 12.253 22 6.589 17.523 2 12 2Z" />
          </svg>
          GitHub
        </a>
      </header>

      {/* IO Grid */}
      <div className="io-grid">
        <div className="panel io-panel">
          <div className="panel-header">
            <span className="panel-label">
              <span className="label-dot input-dot" />
              输入
            </span>
            {lineCount > 0 && (
              <span className="panel-meta">{lineCount} 行</span>
            )}
          </div>
          <textarea
            className="io-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"粘贴多行文本...\n每行一条数据"}
            spellCheck={false}
          />
        </div>

        <div className="io-arrow">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M3.75 9H14.25M14.25 9L10.125 4.875M14.25 9L10.125 13.125" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <div className="panel io-panel">
          <div className="panel-header">
            <span className="panel-label">
              <span className="label-dot output-dot" />
              输出
            </span>
            <div className="panel-actions">
              {resultLineCount > 0 && (
                <span className="panel-meta">{resultLineCount} 行</span>
              )}
              {result && (
                <button className="copy-btn" onClick={copyResult}>
                  复制
                </button>
              )}
            </div>
          </div>
          <textarea
            className="io-textarea"
            value={result}
            readOnly
            placeholder={"结果将显示于此..."}
            spellCheck={false}
          />
        </div>
      </div>

      {/* Actions Panel */}
      <div className="panel actions-panel">
        <div className="ops-section">
          <span className="section-label">操作</span>
          <div className="ops-chips">
            {options.map((op) => (
              <button
                key={op.value}
                className={`op-chip${opt === op.value ? " active" : ""}`}
                onClick={() => setOpt(op.value)}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>

        <div className="code-section">
          <div className="code-header">
            <span className="section-label">代码</span>
            <span className="code-hint">可直接编辑</span>
          </div>
          <textarea
            className="code-textarea"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            spellCheck={false}
            rows={3}
          />
        </div>

        <div className="generate-row">
          <button className="generate-btn" onClick={onGenerate}>
            生成
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
              <path d="M2.5 7.5H12.5M12.5 7.5L8 3M12.5 7.5L8 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;
