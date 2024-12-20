
import OpenAI from "openai";

export default function Qwen() {
    const openai = new OpenAI(
        {
            // 若没有配置环境变量，请用百炼API Key将下行替换为：apiKey: "sk-xxx",
            apiKey: "sk-d29c39ecf16d42d69ba03d871366e591",
            baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1"
        }
    );
    
    async function call_qwen(text: string) {
        const completion = await openai.chat.completions.create({
            model: "qwen-plus",  //模型列表：https://help.aliyun.com/zh/model-studio/getting-started/models
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: text }
            ],
        });
        console.log(JSON.stringify(completion))
        return completion.choices[0].message.content
    }
    const result = call_qwen("你是谁？")
    return <div>{result}</div>
}





