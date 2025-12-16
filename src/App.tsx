import { useState } from "react";
import "./App.css";
import { Button, Input, message, Radio } from "antd";

interface Option {
  label: string;
  value: "custom" | "delSpace";
  code: string;
}
const options: Option[] = [
  {
    label: "去空格",
    value: "delSpace",
    code: "list.map(item => item.replace(/\\s/g, ''))",
  },
  {
    label: "自定义",
    value: "custom",
    code: "list.map(item => item)",
  },
];

const App = () => {
  const [input, setInput] = useState("");
  const [opt, setOpt] = useState<Option["value"]>("custom");
  const [code, setCode] = useState("");
  const [result, setResult] = useState("");
  const onGenerate = () => {
    if (!input) {
      message.error("请输入内容");
      return;
    }
    const list = input.split(/\n/);
    if (!list.length) {
      message.error("请输入内容");
      return;
    }
    try {
      // eslint-disable-next-line react-hooks/unsupported-syntax
      const r = eval(code);
      const str = r.join("\n");
      setResult(str);
      navigator.clipboard.writeText(str);
      message.success("结果已复制到剪切板");
    } catch (error) {
      setResult("");
      message.error(`代码错误: ${error instanceof Error ? error.message : "未知错误"}`);
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
          <Radio.Group
            block
            options={options}
            defaultValue={opt}
            optionType="button"
            onChange={(e) => {
              setOpt(e.target.value);
              setCode(options.find((item) => item.value === e.target.value)?.code || "");
            }}
          />
          <Input.TextArea
            disabled={opt !== "custom"}
            className="input-textarea"
            rows={10}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
      </div>
      <div className="opt-container">
        <Button type="primary" style={{ marginTop: "24px" }} onClick={onGenerate}>
          生成
        </Button>
        <Input.TextArea className="input-textarea" rows={10} value={result} />
      </div>
    </div>
  );
};

export default App;
