const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());

// 配置你的数据库连接
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '6547',
    database: 'planets', // 替换为你建的数据库名
    charset: 'utf8mb4'
});

connection.connect(err => {
    if (err) {
        console.error('❌ 数据库连接失败:', err);
        return;
    }
    console.log('✅ 成功连接到 MySQL 数据库');
});

// GET 接口：返回所有行星数据
app.get('/api/planets', (req, res) => {
    connection.query('SELECT * FROM planets', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }

        const data = {};
        results.forEach(row => {
            data[row.key] = row;
        });
        res.json(data);
    });
});

app.listen(3000, () => {
    console.log('🌍 接口已启动：http://localhost:3000/api/planets');
});
