import fs from 'fs';
import express from 'express';
import cors from 'cors';
import { geminiMain } from './GeminiRouter1.js';  // ✅ 使用新版 GeminiRouter1
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2';
import axios from 'axios';

// 路径设置
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建 Express 实例
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ 跨域配置：允许 localhost:63342 等前端调试环境访问
app.use(cors({
    origin: '*', // 也可以改成 ['http://localhost:63342'] 更安全
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// 提供静态文件（从项目根目录）
app.use(express.static(path.join(__dirname, '..')));

// 连接数据库
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '6547',
    database: 'planets',
    charset: 'utf8mb4'
});

connection.connect(err => {
    if (err) {
        console.error('❌ 数据库连接失败:', err);
    } else {
        console.log('✅ 成功连接到 MySQL 数据库');
    }
});

const planetNames = ['水星', '金星', '地球', '火星', '木星', '土星', '天王星', '海王星'];

// Wikipedia 查询摘要
async function fetchWikipediaSummary(query, language = 'zh') {
    try {
        const baseUrl = `https://${language}.wikipedia.org/w/api.php`;
        const params = {
            action: 'query',
            format: 'json',
            prop: 'extracts',
            exchars: 1000,
            exintro: true,
            explaintext: true,
            redirects: true,
            titles: query,
            origin: '*'
        };

        const response = await axios.get(baseUrl, { params });
        const pages = response.data.query.pages;
        const pageId = Object.keys(pages)[0];

        if (pageId === '-1') {
            return { error: `未找到关于"${query}"的词条` };
        }

        return {
            title: pages[pageId].title,
            summary: pages[pageId].extract,
            language
        };
    } catch (error) {
        console.error('❌ 摘要请求失败:', error.message);
        return { error: '请求失败，请检查网络连接或稍后重试。' };
    }
}

// ✅ Gemini 占卜 API（支持前端直接访问）
app.get('/checkGemini', async (req, res) => {
    const text = req.query.text?.trim();
    console.log(`[Gemini请求] 输入内容: ${text}`);

    if (!text) {
        return res.status(400).send('❌ 错误：缺少 text 参数');
    }

    try {
        const result = await geminiMain(text);
        res.send(result);
    } catch (error) {
        console.error('❌ Gemini API 出错:', error.message);
        const statusCode = error.message.includes('401') ? 401 :
            error.message.includes('400') ? 400 :
                error.message.includes('API调用失败') ? 502 : 500;
        res.status(statusCode).send(`Gemini出错：${error.message}`);
    }
});

// 获取数据库中的所有行星数据
app.get('/api/planets', (req, res) => {
    connection.query('SELECT * FROM planets', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        const data = {};
        results.forEach(row => data[row.key] = row);
        res.json(data);
    });
});

// Wikipedia 图像和摘要复合搜索
app.get('/search', async (req, res) => {
    const query = req.query.query;
    const language = req.query.language || 'zh';

    const result = await fetchWikipediaSummary(query, language);
    if (result.error) return res.json(result);

    try {
        // 主图
        const imgRes = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
            params: {
                action: 'query',
                format: 'json',
                origin: '*',
                prop: 'pageimages',
                titles: query,
                pithumbsize: 600
            }
        });

        const page = Object.values(imgRes.data.query.pages)[0];
        const mainImage = page?.thumbnail?.source || null;

        let extraImage = null;

        // 附图（仅对行星）
        if (planetNames.includes(query)) {
            const imageListResp = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
                params: {
                    action: 'query',
                    format: 'json',
                    origin: '*',
                    prop: 'images',
                    titles: query
                }
            });

            const images = Object.values(imageListResp.data.query.pages)[0].images || [];
            const imageFile = images.find(img =>
                /\.(jpg|jpeg|png)$/i.test(img.title) &&
                (!page.pageimage || !img.title.includes(page.pageimage))
            );

            if (imageFile) {
                const infoResp = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
                    params: {
                        action: 'query',
                        format: 'json',
                        origin: '*',
                        prop: 'imageinfo',
                        iiprop: 'url',
                        titles: imageFile.title
                    }
                });

                extraImage = Object.values(infoResp.data.query.pages)[0]?.imageinfo?.[0]?.url || null;
            }
        }

        res.json({
            title: result.title,
            summary: result.summary,
            mainImage,
            extraImage
        });
    } catch (error) {
        console.error('❌ 图像加载失败:', error.message);
        res.json(result);
    }
});

// 路由配置（静态页面）
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.get('/gemini', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Gemini', 'gemini.html'));
});

app.get('/planets', (req, res) => {
    const files = [
        path.join(__dirname, '..', 'planets (3).html'),
        path.join(__dirname, '..', 'planets (2).html'),
        path.join(__dirname, '..', 'planets.html')
    ];

    for (const file of files) {
        if (fs.existsSync(file)) return res.sendFile(file);
    }

    res.status(404).send('<h1>404 Not Found</h1>');
});

app.get('/constellations', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'constellations.html'));
});

app.get('/star-map.html', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'star-map.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`✅ Server running: http://127.0.0.1:${PORT}`);
});

// 防止崩溃退出
process.on('uncaughtException', err => {
    console.error('未捕获异常:', err);
});
process.on('SIGTERM', () => {
    console.log('收到 SIGTERM，退出...');
    process.exit(0);
});
