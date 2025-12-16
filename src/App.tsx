import { useEffect, useState } from "react";
import "./App.css";
import { Button, Input, message, Radio } from "antd";

interface Option {
  label: string;
  value: "custom" | "delSpace" | "reverse" | "trim";
  code: string;
}
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
      <div className="opt-container" style={{ marginTop: "24px" }}>
        <Radio.Group
          options={options}
          defaultValue={opt}
          optionType="button"
          onChange={(e) => setOpt(e.target.value)}
        />
        <Input.TextArea
          className="input-textarea code-font"
          rows={10}
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
        />
        <Button type="primary" style={{ marginTop: "12px" }} onClick={onGenerate}>
          生成
        </Button>
      </div>
    </div>
  );
};

export default App;
