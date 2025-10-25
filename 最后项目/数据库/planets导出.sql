-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: planets
-- ------------------------------------------------------
-- Server version	8.0.42

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `planets`
--

DROP TABLE IF EXISTS `planets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `planets` (
  `id` int NOT NULL AUTO_INCREMENT,
  `key` varchar(20) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `distance` varchar(50) DEFAULT NULL,
  `description` text,
  `diameter` varchar(50) DEFAULT NULL,
  `rotation` varchar(50) DEFAULT NULL,
  `orbit` varchar(50) DEFAULT NULL,
  `moons` varchar(10) DEFAULT NULL,
  `textureUrl` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key` (`key`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `planets`
--

LOCK TABLES `planets` WRITE;
/*!40000 ALTER TABLE `planets` DISABLE KEYS */;
INSERT INTO `planets` VALUES (1,'sun','太阳','0公里','太阳是太阳系的中心恒星，占据太阳系总质量的约99.86%。','1,392,700 km','25.4 天','不适用','0','./tietu/2k_sun.jpg'),(2,'mercury','水星','5,790万公里','水星是太阳系中最小的行星，也是最靠近太阳的行星。','4,880 km','58.6 天','88 天','0','./tietu/2k_mercury.jpg'),(3,'venus','金星','1.08亿公里','金星是太阳系中最热的行星，拥有浓厚的二氧化碳大气层。','12,103.6 km','243 天','225 天','0','./tietu/2k_venus_surface.jpg'),(4,'earth','地球','1.5亿公里','地球是太阳系中唯一已知存在生命的行星。','12,742 km','24 小时','365 天','1','./tietu/2k_earth_daymap.jpg'),(5,'mars','火星','2.28亿公里','火星因表面富含氧化铁而呈现红色，有太阳系中最高的火山。','6,779 km','24.6 小时','687 天','2','./tietu/2k_mars.jpg'),(6,'jupiter','木星','7.78亿公里','木星是太阳系中最大的行星，是一颗气态巨行星。','139,820 km','9.9 小时','11.86 年','95','./tietu/2k_jupiter.jpg'),(7,'saturn','土星','14.3亿公里','土星以其壮观的光环系统而闻名。','116,460 km','10.7 小时','29.46 年','83','./tietu/2k_saturn.jpg'),(8,'uranus','天王星','28.7亿公里','天王星是一颗冰巨星，自转轴倾斜度极大。','50,724 km','17.2 小时','84 年','27','./tietu/2k_uranus.jpg'),(9,'neptune','海王星','44.9亿公里','海王星是太阳系中最远的行星，有强烈的风暴。','49,244 km','16.1 小时','164.8 年','14','./tietu/2k_neptune.jpg');
/*!40000 ALTER TABLE `planets` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-07-27 16:16:37
