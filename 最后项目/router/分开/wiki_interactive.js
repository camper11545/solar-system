const axios = require('axios');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

// 支持的行星名称（用于判断是否加载附图）
const planetNames = ['水星', '金星', '地球', '火星', '木星', '土星', '天王星', '海王星'];

// 获取维基百科文字摘要
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
            return { error: `未找到关于"${query}"的${language === 'zh' ? '中文' : '英文'}词条` };
        }

        return {
            title: pages[pageId].title,
            summary: pages[pageId].extract,
            language: language
        };
    } catch (error) {
        console.error(`请求摘要失败:`, error.message);
        return { error: '请求失败，请检查网络连接或重试' };
    }
}

// 主接口：返回摘要 + 主图（+ 附图：仅行星）
app.get('/search', async (req, res) => {
    const query = req.query.query;
    const language = req.query.language || 'zh';

    const result = await fetchWikipediaSummary(query, language);
    if (result.error) {
        return res.json(result);
    }

    try {
        // === 主图 ===
        const imageResp = await axios.get(`https://${language}.wikipedia.org/w/api.php`, {
            params: {
                action: 'query',
                format: 'json',
                origin: '*',
                prop: 'pageimages',
                titles: query,
                pithumbsize: 600
            }
        });

        const pages = imageResp.data.query.pages;
        const page = Object.values(pages)[0];
        let mainImage = null;
        if (page && page.thumbnail && page.thumbnail.source) {
            mainImage = page.thumbnail.source;
        }

        let extraImage = null;

        // ✅ 仅当是行星时加载附图
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

            const imageListPage = Object.values(imageListResp.data.query.pages)[0];
            const imageTitles = imageListPage.images || [];

            const imageFile = imageTitles.find(img =>

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

                const infoPage = Object.values(infoResp.data.query.pages)[0];
                if (infoPage?.imageinfo?.[0]?.url) {
                    extraImage = infoPage.imageinfo[0].url;
                }
            }
        }

        res.json({
            title: result.title,
            summary: result.summary,
            mainImage,
            extraImage
        });

    } catch (error) {
        console.error('图像加载失败:', error.message);
        res.json(result); // 返回文字摘要即可
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
