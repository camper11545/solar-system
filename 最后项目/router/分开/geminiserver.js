import fs from 'fs';
import express from 'express';
import cors from 'cors';
import { geminiMain } from './GeminiRouter.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件配置
app.use(cors());
app.use(express.json());

// 静态文件服务 - 提供项目根目录下的所有文件
app.use(express.static(path.join(__dirname, '..')));

// API路由
app.get("/checkGemini", async (req, res) => {
    const text = req.query.text?.trim();
    console.log(`[${new Date().toISOString()}] 收到请求:`, text);

    // 验证输入
    if (!text) {
        return res.status(400).send('错误：请提供查询内容');
    }

    try {
        const result = await geminiMain(text);
        console.log(`[${new Date().toISOString()}] 响应成功`);
        res.send(result);
    } catch (error) {
        console.error(`[${new Date().toISOString()}] 处理失败:`, error);
        // 根据错误类型设置状态码
        const statusCode = error.message.includes('401') ? 401 :
            error.message.includes('400') ? 400 : 
            error.message.includes('API调用失败') ? 502 : 500;
        res.status(statusCode).send(`❌ ${error.message}`);
    }
});

// 添加更多页面路由，确保能正确访问各种HTML文件
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get("/gemini", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Gemini', 'gemini.html'));
});

app.get("/planets", (req, res) => {
    // 尝试提供存在的行星页面文件
    const planetsFiles = [
        path.join(__dirname, '..', 'planets (3).html'),
        path.join(__dirname, '..', 'planets (2).html'),
        path.join(__dirname, '..', 'planets.html')
    ];
    
    for (const file of planetsFiles) {
        if (fs.existsSync(file)) {
            return res.sendFile(file);
        }
    }
    
    // 如果都不存在，返回404页面
    res.status(404).send('<!doctype html><title>404 Not Found</title><h1 style="text-align: center">404 Not Found</h1>');
});

app.get("/constellations", (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'constellations.html'));
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://127.0.0.1:${PORT}`);
    console.log(`Try accessing: http://127.0.0.1:${PORT}/`);
    console.log(`Or try: http://127.0.0.1:${PORT}/gemini`);
    console.log(`Or try: http://127.0.0.1:${PORT}/planets`);
});

// 在文件末尾添加进程守护代码
// 防止意外退出
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
});

process.on('SIGTERM', () => {
  console.log('收到SIGTERM信号，准备退出...');
  process.exit(0);
});