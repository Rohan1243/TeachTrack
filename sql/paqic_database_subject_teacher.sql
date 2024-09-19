-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: paqic_database
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `subject_teacher`
--

DROP TABLE IF EXISTS `subject_teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subject_teacher` (
  `secret_key` varchar(255) NOT NULL,
  `subject_id` int NOT NULL,
  `subject_status` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`secret_key`,`subject_id`),
  KEY `adding_fk4` (`subject_id`),
  CONSTRAINT `adding_fk3` FOREIGN KEY (`secret_key`) REFERENCES `teacher_details` (`secret_key`),
  CONSTRAINT `adding_fk4` FOREIGN KEY (`subject_id`) REFERENCES `subject_code` (`subject_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subject_teacher`
--

LOCK TABLES `subject_teacher` WRITE;
/*!40000 ALTER TABLE `subject_teacher` DISABLE KEYS */;
INSERT INTO `subject_teacher` VALUES ('1n466a',11,0),('1n466a',14,0),('1n466a',15,1),('aD8gJ8',11,0),('aD8gJ8',12,0),('aD8gJ8',13,1),('aD8gJ8',15,1),('DTzmct',10,1),('DTzmct',14,1),('DTzmct',15,0),('ExLVHZ',13,0),('ExLVHZ',14,1),('ExLVHZ',15,0),('FE13oQ',10,0),('FE13oQ',11,1),('IDeu5j',12,0),('IDeu5j',13,0),('IDeu5j',15,1),('LRZCb2',11,0),('LRZCb2',14,1),('LRZCb2',15,0),('nj22zj',14,1),('nj22zj',15,0),('QaBqbN',10,0),('QaBqbN',12,1),('QaBqbN',14,0),('QaBqbN',15,1),('SfNEob',13,0),('SfNEob',14,1),('SfNEob',15,0);
/*!40000 ALTER TABLE `subject_teacher` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-24 15:09:16
