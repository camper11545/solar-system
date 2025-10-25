// geminiserver.js
import fs from 'fs';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// 获取当前模块的目录名
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log(`[服务器启动] 当前目录: ${__dirname}`);

// 正确解析 GeminiRouter.js 的路径
// GeminiRouter.js 位于 D:\...\最后项目\router\GeminiRouter.js
// geminiserver.js 位于 D:\...\最后项目\router\分开\geminiserver.js
// 所以从 __dirname 到 GeminiRouter.js 需要 '..'
const geminiRouterPath = path.resolve(__dirname, '..', 'GeminiRouter.js');
console.log(`[服务器启动] 检查 GeminiRouter.js 文件是否存在: ${geminiRouterPath}`);

let geminiMain;

if (fs.existsSync(geminiRouterPath)) {
    console.log('[服务器启动] GeminiRouter.js 文件存在。正在导入。');
    try {
        const geminiRouterURL = pathToFileURL(geminiRouterPath).href;
        ({ geminiMain } = await import(geminiRouterURL));
        console.log('[服务器启动] GeminiRouter.js 导入成功。');
    } catch (importError) {
        console.error(`[服务器启动] 导入 GeminiRouter.js 时出错: ${importError.message}`);
        geminiMain = async (text) => {
            console.warn('[服务器模拟] GeminiRouter.js 未找到或导入失败，返回模拟响应。');
            return `模拟响应：${text} (Gemini API 功能不可用，错误: ${importError.message})`;
        };
    }
} else {
    console.error(`[服务器启动] GeminiRouter.js 文件不存在: ${geminiRouterPath}。Gemini API 功能将不可用。`);
    geminiMain = async (text) => {
        console.warn('[服务器模拟] GeminiRouter.js 未找到，返回模拟响应。');
        return `模拟响应：${text} (Gemini API 功能不可用)`;
    };
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 静态文件服务 - 从项目根目录 (即 '最后项目' 目录) 提供所有文件
// geminiserver.js 在 '分开' 文件夹内，所以需要 '..' 再 '..' 才能到 '最后项目'
const projectRoot = path.join(__dirname, '..', '..');
app.use(express.static(projectRoot));
console.log(`[服务器启动] 正在从以下位置提供静态文件: ${projectRoot}`);

// 用于 Gemini 占卜的 API 路由
app.get("/checkGemini", async (req, res) => {
    console.log(`[请求接收] /checkGemini 端点被访问。`);
    const text = req.query.text?.trim();
    console.log(`[${new Date().toISOString()}] 接收到的请求文本:`, text);

    if (!text) {
        console.warn(`[${new Date().toISOString()}] 错误请求: 未提供查询文本。`);
        return res.status(400).send('错误: 请提供查询文本');
    }

    if (!geminiMain) {
        console.error(`[${new Date().toISOString()}] 内部服务器错误: GeminiMain 函数未加载。`);
        return res.status(500).send('错误: 占卜服务内部错误，Gemini功能未加载');
    }

    try {
        const result = await geminiMain(text);
        console.log(`[${new Date().toISOString()}] 成功响应 Gemini 结果。`);
        res.send(result);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] 处理 Gemini API 失败:`, error);
        const statusCode = error.message.includes('401') ? 401 :
            error.message.includes('400') ? 400 :
                error.message.includes('API call failed') ? 502 : 500;
        res.status(statusCode).send(`❌ 占卜失败: ${error.message}`);
    }
});

// 添加更多页面路由以确保正确访问各种 HTML 文件
// 这些文件现在应该在 projectRoot 下
app.get("/", (req, res) => {
    console.log(`[请求接收] 正在提供 index.html`);
    res.sendFile(path.join(projectRoot, 'index.html'));
});

app.get("/gemini", (req, res) => {
    console.log(`[请求接收] 正在提供 gemini.html`);
    // 假设 gemini.html 位于 projectRoot 下的 'Gemini' 子文件夹中
    res.sendFile(path.join(projectRoot, 'Gemini', 'gemini.html'));
});

app.get("/planets", (req, res) => {
    console.log(`[请求接收] 正在提供行星页面`);
    const planetsFiles = [
        path.join(projectRoot, 'planets (3).html'),
        path.join(projectRoot, 'planets (2).html'),
        path.join(projectRoot, 'planets.html')
    ];

    for (const file of planetsFiles) {
        if (fs.existsSync(file)) {
            return res.sendFile(file);
        }
    }
    res.status(404).send('<!doctype html><title>404 Not Found</title><h1 style="text-align: center">404 Not Found</h1>');
});

app.get("/constellations", (req, res) => {
    console.log(`[请求接收] 正在提供 constellations.html`);
    res.sendFile(path.join(projectRoot, 'constellations.html'));
});

// 为 star-map.html 添加显式路由
app.get("/star-map.html", (req, res) => {
    console.log(`[请求接收] 正在提供 star-map.html`);
    res.sendFile(path.join(projectRoot, 'star-map.html'));
});


app.listen(PORT, () => {
    console.log(`服务器正在端口 ${PORT} 上运行`);
    console.log(`http://127.0.0.1:${PORT}`);
    console.log(`尝试访问: http://127.0.0.1:${PORT}/`);
    console.log(`或尝试: http://127.0.0.1:${PORT}/gemini`);
    console.log(`或尝试: http://127.0.0.1:${PORT}/planets`);
    console.log(`或尝试: http://127.0.0.1:${PORT}/star-map.html`);
});

process.on('uncaughtException', (err) => {
    console.error('未捕获的异常:', err);
});

process.on('SIGTERM', () => {
    console.log('收到 SIGTERM 信号，准备退出...');
    process.exit(0);
});
