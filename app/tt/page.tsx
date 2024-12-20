
export default async function TT() {
    const { GoogleGenerativeAI } = require("@google/generative-ai");

    const genAI = new GoogleGenerativeAI("AIzaSyDUu9RLhvDgCPCA1woklhU4zcDDPP6QmWc");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const prompt = "Explain how AI works";
    
    const result = await model.generateContent(prompt);
    console.log(result.response.text());
    return <div>{result.response.text()}</div>
}

