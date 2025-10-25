import { GoogleGenAI } from "@google/genai";

async function geminiMain(text) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ text: text }],
        });
        
        // 检查响应是否有效
        if (!response || !response.text) {
            throw new Error("无效的API响应");
        }
        
        console.log("API响应:", response.text);
        return response.text;
    } catch (error) {
        console.error("Gemini API调用失败:", error);
        throw new Error(`API调用失败: ${error.message}`);
    }
}

const ai = new GoogleGenAI({ apiKey: "AIzaSyAoe1uZuFSW2UxVIf0Ii61KXNMPB3QLFOw" });

// 修复main函数中的参数名称问题
async function main(txt) {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{ text: txt }],
        });
        
        // 检查响应是否有效
        if (!response || !response.text) {
            throw new Error("无效的API响应");
        }
        
        return response.text;
    } catch (error) {
        console.error("Gemini API调用失败:", error);
        throw new Error(`API调用失败: ${error.message}`);
    }
}

export { geminiMain, main }