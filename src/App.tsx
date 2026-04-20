import { useEffect, useState } from "react";
import "./App.css";
import { Button, Input, message, Radio } from "antd";

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
  {
    label: "去空格",
    value: "delSpace",
    code: ".map(item => item.replace(/\\s/g, ''))",
  },
  {
    label: "去首尾空格",
    value: "trim",
    code: ".map(item => item.trim())",
  },
  {
    label: "去空行",
    value: "removeBlank",
    code: ".filter(item => item.trim() !== '')",
  },
  {
    label: "合并空白",
    value: "collapseWhitespace",
    code: ".map(item => item.replace(/\\s+/g, ' ').trim())",
  },
  {
    label: "去序号/符号",
    value: "stripListPrefix",
    code: ".map(item => item.replace(/^\\s*(?:[-•*]|\\d+[.)、])\\s*/, ''))",
  },
  {
    label: "去引号",
    value: "stripQuotes",
    code: ".map(item => item.replace(/^[\"']|[\"']$/g, ''))",
  },
  {
    label: "去重",
    value: "dedupe",
    code: ".filter((item, index, arr) => arr.indexOf(item) === index)",
  },
  {
    label: "取反",
    value: "reverse",
    code: ".map(item => isNaN(item) ? item : Number(item) * -1)",
  },
  {
    label: "自定义",
    value: "custom",
    code: ".map(item => item)",
  },
];

const App = () => {
  const [input, setInput] = useState("");
  const [opt, setOpt] = useState<Option["value"]>("delSpace");
  const [customCode, setCustomCode] = useState("");
  const [result, setResult] = useState("");
  useEffect(() => {
    const optCode = options.find((item) => item.value === opt)?.code;
    if (optCode) {
      setCustomCode(commonSplit + optCode + commonJoin);
    } else {
      setCustomCode("");
    }
  }, [opt]);
  const onGenerate = () => {
    if (!customCode) {
      message.error("请选择操作或输入自定义代码");
      return;
    }
    if (!input) {
      message.error("请输入内容");
      return;
    }
    try {
      // eslint-disable-next-line react-hooks/unsupported-syntax
      const str = eval(customCode);
      setResult(str);
      navigator.clipboard.writeText(str);
      message.success("结果已复制到剪切板");
    } catch (error) {
      setResult("");
      message.error(`代码错误: ${error instanceof Error ? error.message : "未知错误"}`);
      console.error(error);
    }
  };
  return (
    <div className="app">
      <div className="app-header">
        <div>
          <div className="app-title">Excel Tools</div>
          <div className="app-subtitle">多行文本与表格列数据处理工具</div>
        </div>
        <a className="github-link" href={githubUrl} target="_blank" rel="noreferrer">
          <svg viewBox="0 0 24 24" aria-hidden="true" className="github-icon">
            <path
              fill="currentColor"
              d="M12 2C6.477 2 2 6.589 2 12.253c0 4.53 2.865 8.374 6.839 9.73.5.095.682-.221.682-.492 0-.244-.009-.89-.014-1.747-2.782.617-3.369-1.37-3.369-1.37-.455-1.183-1.11-1.498-1.11-1.498-.908-.636.069-.623.069-.623 1.004.072 1.532 1.054 1.532 1.054.892 1.57 2.341 1.116 2.91.854.091-.664.349-1.116.635-1.373-2.221-.259-4.555-1.138-4.555-5.063 0-1.119.389-2.034 1.029-2.752-.103-.259-.446-1.302.098-2.714 0 0 .84-.276 2.75 1.051A9.35 9.35 0 0 1 12 6.836a9.31 9.31 0 0 1 2.504.347c1.909-1.327 2.748-1.051 2.748-1.051.546 1.412.203 2.455.1 2.714.64.718 1.028 1.633 1.028 2.752 0 3.935-2.338 4.801-4.566 5.055.359.319.679.948.679 1.91 0 1.379-.012 2.49-.012 2.829 0 .273.18.592.688.491C19.138 20.624 22 16.781 22 12.253 22 6.589 17.523 2 12 2Z"
            />
          </svg>
          <span>GitHub</span>
        </a>
      </div>
      <div className="opt-block">
        <div className="opt-container">
          <div className="opt-title">输入</div>
          <Input.TextArea
            className="input-textarea"
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>

        <div className="opt-container">
          <div className="opt-title">输出</div>
          <Input.TextArea className="input-textarea" rows={10} value={result} />
        </div>
      </div>
      <div className="opt-container opt-actions">
        <div className="operation-options">
          <Radio.Group
            options={options}
            defaultValue={opt}
            optionType="button"
            onChange={(e) => setOpt(e.target.value)}
          />
        </div>
        <Input.TextArea
          className="input-textarea code-font"
          rows={10}
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
        />
        <div className="submit-row">
          <Button type="primary" onClick={onGenerate}>
            生成
          </Button>
        </div>
      </div>
    </div>
  );
};

export default App;
