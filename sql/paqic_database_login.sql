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
-- Table structure for table `login`
--

DROP TABLE IF EXISTS `login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `login` (
  `secret_key` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`secret_key`),
  CONSTRAINT `adding_fk1` FOREIGN KEY (`secret_key`) REFERENCES `id` (`secret_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `login`
--

LOCK TABLES `login` WRITE;
/*!40000 ALTER TABLE `login` DISABLE KEYS */;
INSERT INTO `login` VALUES ('1n466a','Mr. V. R. Jaiswal','hiray@gmail.com','$2b$10$Dl5XLjo3WBpW4qnu1sqzJut23vF9S293ckxXOXsSigNGROgopuYpe'),('A123','Adwait','adwait@gmail.com','$2b$10$4mDN9P1mOJeKTL7JhOF5P.JEf/B5vWwe5ukUjg2B5d2Kz0Wf5cdb.'),('aD8gJ8','Mrs. K. Y. Digholkar','kd@gmail.com','$2b$10$96m8HLLVKL1JMVWve1j5IulxapyLkAmHxHTY3wyc7Ke0fuxwhmWIK'),('DTzmct','Mrs. S. R. Hiray','hiray@gmail.com','$2b$10$pYkAjYkwfK8UVoQXx/GIs.Rro6XXnQwXkL.r2efQztSZR/1B3.4Dy'),('ExLVHZ','Mrs. A. S. Kadam','ak@gmail.com','$2b$10$vYKga9U2.agYEzJ0wLbYde0cUMYU2a8gcTZQ6KCEiOFoItexG6T2C'),('FE13oQ','Mrs. J. B. Jagdale','adwaitmali73@gmail.com','$2b$10$lwVuUX71JglduJ3whNIif..48Ri38ggFRVZ3kGjD8SFLw1fCkHFJm'),('IDeu5j','Mrs. S. A. Jakhete','sj@gmail.com','$2b$10$KKBu9jVmVqv2xjvqPtH56.LIZHpX/pcVhrbzkeChMYYkfmQniwyd.'),('LRZCb2','Mr. S. D. Shelke','ss@gmail.com','$2b$10$0YeI/lX1ofTpuyLbyvuNNut7Rgva.1qy/2232zKRBJBBlN3odVd4C'),('nj22zj','Mrs. D. P. Salapurkar','ds@gmail.com','$2b$10$Wx9dEHXHNnVIr8whpDkufeVgH8iMH/yQTfRSvLNZcP1N8KjOB7v3q'),('QaBqbN','Mr. M. R. Khodaskar','mk@gmail.com','$2b$10$9aEKs9Z.jU9OWOfhYTpI6ONb1j3XNv8QGBL.LQLlr0SSQ9OODM.tC'),('SfNEob','Mr. N. V. Buradkar','nb@gmail.com','$2b$10$VciohWOeKIj7rd3GOtqrH.Quf9oOmDybHrqa62lxcIn8psmriLr/i');
/*!40000 ALTER TABLE `login` ENABLE KEYS */;
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
