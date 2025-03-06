-- MySQL dump 10.13  Distrib 5.7.44, for Linux (x86_64)
--
-- Host: localhost    Database: mydatabase
-- ------------------------------------------------------
-- Server version	5.7.44
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;

/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;

/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;

/*!40101 SET NAMES utf8 */;

/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;

/*!40103 SET TIME_ZONE='+00:00' */;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;

/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;

/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;

/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `At_Location`
--
DROP TABLE IF EXISTS `At_Location`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!40101 SET character_set_client = utf8 */;

CREATE TABLE
  `At_Location` (
    `l_id` char(36) NOT NULL,
    `location` point DEFAULT NULL,
    `address` varchar(50) DEFAULT NULL,
    PRIMARY KEY (`l_id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = latin1;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `At_Location`
--
LOCK TABLES `At_Location` WRITE;

/*!40000 ALTER TABLE `At_Location` DISABLE KEYS */;

/*!40000 ALTER TABLE `At_Location` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `Comments`
--
DROP TABLE IF EXISTS `Comments`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!40101 SET character_set_client = utf8 */;

CREATE TABLE
  `Comments` (
    `c_id` char(36) NOT NULL,
    `e_id` char(36) NOT NULL,
    `u_id` char(36) NOT NULL,
    `text` varchar(150) DEFAULT NULL,
    `rating` int (11) DEFAULT NULL,
    PRIMARY KEY (`c_id`),
    KEY `e_id` (`e_id`),
    KEY `u_id` (`u_id`),
    CONSTRAINT `Comments_ibfk_1` FOREIGN KEY (`e_id`) REFERENCES `Events` (`e_id`),
    CONSTRAINT `Comments_ibfk_2` FOREIGN KEY (`u_id`) REFERENCES `Students` (`stu_id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = latin1;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Comments`
--
LOCK TABLES `Comments` WRITE;

/*!40000 ALTER TABLE `Comments` DISABLE KEYS */;

/*!40000 ALTER TABLE `Comments` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `Events`
--
DROP TABLE IF EXISTS `Events`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!40101 SET character_set_client = utf8 */;

CREATE TABLE
  `Events` (
    `e_id` char(36) NOT NULL,
    `contact_info` varchar(40) DEFAULT NULL,
    `name` varchar(20) DEFAULT NULL,
    `description` varchar(150) DEFAULT NULL,
    `time` datetime DEFAULT NULL,
    `category` varchar(20) DEFAULT NULL,
    `location` char(36) DEFAULT NULL,
    PRIMARY KEY (`e_id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = latin1;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Events`
--
LOCK TABLES `Events` WRITE;

/*!40000 ALTER TABLE `Events` DISABLE KEYS */;

/*!40000 ALTER TABLE `Events` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `Private_Event`
--
DROP TABLE IF EXISTS `Private_Event`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!40101 SET character_set_client = utf8 */;

CREATE TABLE
  `Private_Event` (
    `e_id` char(36) NOT NULL,
    `associated_uni` char(36) DEFAULT NULL,
    PRIMARY KEY (`e_id`),
    KEY `associated_uni` (`associated_uni`),
    CONSTRAINT `Private_Event_ibfk_1` FOREIGN KEY (`e_id`) REFERENCES `Events` (`e_id`),
    CONSTRAINT `Private_Event_ibfk_2` FOREIGN KEY (`associated_uni`) REFERENCES `University` (`u_id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = latin1;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Private_Event`
--
LOCK TABLES `Private_Event` WRITE;

/*!40000 ALTER TABLE `Private_Event` DISABLE KEYS */;

/*!40000 ALTER TABLE `Private_Event` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `RSO`
--
DROP TABLE IF EXISTS `RSO`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!40101 SET character_set_client = utf8 */;

CREATE TABLE
  `RSO` (
    `rso_id` char(36) NOT NULL,
    `admin_id` char(36) NOT NULL,
    `name` varchar(30) DEFAULT NULL,
    `associated_university` char(36) DEFAULT NULL,
    `member_count` int (11) DEFAULT NULL,
    PRIMARY KEY (`rso_id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = latin1;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RSO`
--
LOCK TABLES `RSO` WRITE;

/*!40000 ALTER TABLE `RSO` DISABLE KEYS */;

/*!40000 ALTER TABLE `RSO` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `RSO_Event`
--
DROP TABLE IF EXISTS `RSO_Event`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!40101 SET character_set_client = utf8 */;

CREATE TABLE
  `RSO_Event` (
    `e_id` char(36) NOT NULL,
    `related_RSO` char(36) DEFAULT NULL,
    `associated_uni` char(36) DEFAULT NULL,
    PRIMARY KEY (`e_id`),
    KEY `related_RSO` (`related_RSO`),
    KEY `associated_uni` (`associated_uni`),
    CONSTRAINT `RSO_Event_ibfk_1` FOREIGN KEY (`e_id`) REFERENCES `Events` (`e_id`),
    CONSTRAINT `RSO_Event_ibfk_2` FOREIGN KEY (`related_RSO`) REFERENCES `RSO` (`rso_id`),
    CONSTRAINT `RSO_Event_ibfk_3` FOREIGN KEY (`associated_uni`) REFERENCES `University` (`u_id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = latin1;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RSO_Event`
--
LOCK TABLES `RSO_Event` WRITE;

/*!40000 ALTER TABLE `RSO_Event` DISABLE KEYS */;

/*!40000 ALTER TABLE `RSO_Event` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `RSO_Member`
--
DROP TABLE IF EXISTS `RSO_Member`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!40101 SET character_set_client = utf8 */;

CREATE TABLE
  `RSO_Member` (
    `rso_id` char(36) NOT NULL,
    `stu_id` char(36) NOT NULL,
    PRIMARY KEY (`rso_id`, `stu_id`),
    KEY `stu_id` (`stu_id`),
    CONSTRAINT `RSO_Member_ibfk_1` FOREIGN KEY (`rso_id`) REFERENCES `RSO` (`rso_id`),
    CONSTRAINT `RSO_Member_ibfk_2` FOREIGN KEY (`stu_id`) REFERENCES `Students` (`stu_id`)
  ) ENGINE = InnoDB DEFAULT CHARSET = latin1;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `RSO_Member`
--
LOCK TABLES `RSO_Member` WRITE;

/*!40000 ALTER TABLE `RSO_Member` DISABLE KEYS */;

/*!40000 ALTER TABLE `RSO_Member` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `Students`
--
DROP TABLE IF EXISTS `Students`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!40101 SET character_set_client = utf8 */;

CREATE TABLE
  `Students` (
    `stu_id` char(36) NOT NULL,
    `password` varchar(64) DEFAULT NULL,
    `email` varchar(30) DEFAULT NULL UNIQUE,
    `university` char(36) DEFAULT NULL,
    PRIMARY KEY (`stu_id`),
    UNIQUE KEY `email` (`email`)
  ) ENGINE = InnoDB DEFAULT CHARSET = latin1;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Students`
--
LOCK TABLES `Students` WRITE;

/*!40000 ALTER TABLE `Students` DISABLE KEYS */;

INSERT INTO
  `Students`
VALUES
  (
    '4d5e6f7g-8h9i-0j1-k2l3-m4n5o6p7q8r9',
    'password123',
    'student1@universitya.edu',
    '1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6'
  ),
  (
    '5e6f7g8h-9i0j-k1l2-m3n4-o5p6q7r8s9t0',
    'securepass456',
    'student2@universityb.edu',
    '2b3c4d5e-6f7g-8h9i-0j1k-l2m3n4o5p6q7'
  ),
  (
    '6f7g8h9i-0j1k-l2m3-n4o5-p6q7r8s9t0u1',
    'mypassword789',
    'student3@universityc.edu',
    '3c4d5e6f-7g8h-9i0j-k1l2-m3n4o5p6q7r8'
  ),
  (
    '7g8h9i0j-k1l2-m3n4-o5p6-q7r8s9t0u1v2',
    'mypassword123',
    'student4@universityd.edu',
    '4d5e6f7g-8h9i-0j1-k2l3-m4n5o6p7q8r9'
  ),
  (
    '8h9i0j1k-l2m3-n4o5-p6q7-r8s9t0u1v2w3',
    'securepass456',
    'student5@universitye.edu',
    '5e6f7g8h-9i0j-k1l2-m3n4-o5p6q7r8s9t0'
  ),
  (
    '9i0j1k2l-m3n4-o5p6-q7r8-s9t0u1v2w3x4',
    'password789',
    'student6@universityf.edu',
    '6f7g8h9i-0j1k-l2m3-n4o5-p6q7r8s9t0u1'
  );

/*!40000 ALTER TABLE `Students` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `Super_Admins`
--
DROP TABLE IF EXISTS `Super_Admins`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!40101 SET character_set_client = utf8 */;

CREATE TABLE
  `Super_Admins` (
    `sa_id` char(36) NOT NULL,
    `password` varchar(64) DEFAULT NULL,
    `email` varchar(30) DEFAULT NULL UNIQUE,
    `university` char(36) DEFAULT NULL,
    PRIMARY KEY (`sa_id`),
    UNIQUE KEY `email` (`email`)
  ) ENGINE = InnoDB DEFAULT CHARSET = latin1;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Super_Admins`
--
LOCK TABLES `Super_Admins` WRITE;

/*!40000 ALTER TABLE `Super_Admins` DISABLE KEYS */;

INSERT INTO
  `Super_Admins`
VALUES
  (
    '0j1k2l3m-n4o5-p6q7-r8s9-t0u1v2w3x4y5',
    'adminpass123',
    'admin3@universityd.edu',
    '4d5e6f7g-8h9i-0j1-k2l3-m4n5o6p7q8r9'
  ),
  (
    '1k2l3m4n-o5p6-q7r8-s9t0-u1v2w3x4y5z6',
    'adminsecure456',
    'admin4@universitye.edu',
    '5e6f7g8h-9i0j-k1l2-m3n4-o5p6q7r8s9t0'
  ),
  (
    '2l3m4n5o-p6q7-r8s9-t0u1-v2w3x4y5z6a7',
    'superadminpass789',
    'admin5@universityf.edu',
    '6f7g8h9i-0j1k-l2m3-n4o5-p6q7r8s9t0u1'
  ),
  (
    '7g8h9i0j-k1l2-m3n4-o5p6-q7r8s9t0u1v2',
    'adminpass123',
    'admin1@universitya.edu',
    '1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6'
  ),
  (
    '8h9i0j1k-l2m3-n4o5-p6q7-r8s9t0u1v2w3',
    'adminsecure456',
    'admin2@universityb.edu',
    '2b3c4d5e-6f7g-8h9i-0j1k-l2m3n4o5p6q7'
  );

/*!40000 ALTER TABLE `Super_Admins` ENABLE KEYS */;

UNLOCK TABLES;

--
-- Table structure for table `University`
--
DROP TABLE IF EXISTS `University`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!40101 SET character_set_client = utf8 */;

CREATE TABLE
  `University` (
    `u_id` char(36) NOT NULL,
    `name` varchar(50) NOT NULL,
    PRIMARY KEY (`u_id`),
    UNIQUE KEY `name` (`name`)
  ) ENGINE = InnoDB DEFAULT CHARSET = latin1;

/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `University`
--
LOCK TABLES `University` WRITE;

/*!40000 ALTER TABLE `University` DISABLE KEYS */;

INSERT INTO
  `University`
VALUES
  (
    '1a2b3c4d-5e6f-7g8h-9i0j-k1l2m3n4o5p6',
    'University A'
  ),
  (
    '2b3c4d5e-6f7g-8h9i-0j1k-l2m3n4o5p6q7',
    'University B'
  ),
  (
    '3c4d5e6f-7g8h-9i0j-k1l2-m3n4o5p6q7r8',
    'University C'
  ),
  (
    '4d5e6f7g-8h9i-0j1-k2l3-m4n5o6p7q8r9',
    'University D'
  ),
  (
    '5e6f7g8h-9i0j-k1l2-m3n4-o5p6q7r8s9t0',
    'University E'
  ),
  (
    '6f7g8h9i-0j1k-l2m3-n4o5-p6q7r8s9t0u1',
    'University F'
  );

/*!40000 ALTER TABLE `University` ENABLE KEYS */;

UNLOCK TABLES;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-02-17 23:56:33