USE planets;

DROP TABLE IF EXISTS planets;
CREATE TABLE planets (
                         id INT AUTO_INCREMENT PRIMARY KEY,
                         `key` VARCHAR(20) UNIQUE,
                         name VARCHAR(50),
                         distance VARCHAR(50),
                         description TEXT,
                         diameter VARCHAR(50),
                         rotation VARCHAR(50),
                         orbit VARCHAR(50),
                         moons VARCHAR(10),
                         textureUrl VARCHAR(100)
);

INSERT INTO planets (`key`, name, distance, description, diameter, rotation, orbit, moons, textureUrl) VALUES
                                                                                                           ('sun', '太阳', '0公里', '太阳是太阳系的中心恒星，占据太阳系总质量的约99.86%。', '1,392,700 km', '25.4 天', '不适用', '0', './tietu/2k_sun.jpg'),
                                                                                                           ('mercury', '水星', '5,790万公里', '水星是太阳系中最小的行星，也是最靠近太阳的行星。', '4,880 km', '58.6 天', '88 天', '0', './tietu/2k_mercury.jpg'),
                                                                                                           ('venus', '金星', '1.08亿公里', '金星是太阳系中最热的行星，拥有浓厚的二氧化碳大气层。', '12,103.6 km', '243 天', '225 天', '0', './tietu/2k_venus_surface.jpg'),
                                                                                                           ('earth', '地球', '1.5亿公里', '地球是太阳系中唯一已知存在生命的行星。', '12,742 km', '24 小时', '365 天', '1', './tietu/2k_earth_daymap.jpg'),
                                                                                                           ('mars', '火星', '2.28亿公里', '火星因表面富含氧化铁而呈现红色，有太阳系中最高的火山。', '6,779 km', '24.6 小时', '687 天', '2', './tietu/2k_mars.jpg'),
                                                                                                           ('jupiter', '木星', '7.78亿公里', '木星是太阳系中最大的行星，是一颗气态巨行星。', '139,820 km', '9.9 小时', '11.86 年', '95', './tietu/2k_jupiter.jpg'),
                                                                                                           ('saturn', '土星', '14.3亿公里', '土星以其壮观的光环系统而闻名。', '116,460 km', '10.7 小时', '29.46 年', '83', './tietu/2k_saturn.jpg'),
                                                                                                           ('uranus', '天王星', '28.7亿公里', '天王星是一颗冰巨星，自转轴倾斜度极大。', '50,724 km', '17.2 小时', '84 年', '27', './tietu/2k_uranus.jpg'),
                                                                                                           ('neptune', '海王星', '44.9亿公里', '海王星是太阳系中最远的行星，有强烈的风暴。', '49,244 km', '16.1 小时', '164.8 年', '14', './tietu/2k_neptune.jpg');
