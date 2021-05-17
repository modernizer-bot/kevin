# ************************************************************
# Sequel Ace SQL dump
# 版本号： 3028
#
# https://sequel-ace.com/
# https://github.com/Sequel-Ace/Sequel-Ace
#
# 主机: 192.168.10.10 (MySQL 5.7.29-log)
# 数据库: kevin
# 生成时间: 2021-05-17 13:58:37 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
SET NAMES utf8mb4;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE='NO_AUTO_VALUE_ON_ZERO', SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# 转储表 account
# ------------------------------------------------------------

DROP TABLE IF EXISTS `account`;

CREATE TABLE `account` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('admin','company') NOT NULL DEFAULT 'company' COMMENT '账号类型',
  `username` varchar(32) NOT NULL DEFAULT '' COMMENT '账号',
  `password` varchar(255) NOT NULL DEFAULT '' COMMENT '密码',
  `name` varchar(32) DEFAULT NULL COMMENT '姓名',
  `phone` varchar(32) DEFAULT NULL COMMENT '电话',
  `address` varchar(255) DEFAULT NULL COMMENT '地址',
  `last_ip` varchar(128) DEFAULT NULL COMMENT '最近登录IP',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '账号状态，1=激活，0=禁用',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='登录账号';

LOCK TABLES `account` WRITE;
/*!40000 ALTER TABLE `account` DISABLE KEYS */;

INSERT INTO `account` (`id`, `type`, `username`, `password`, `name`, `phone`, `address`, `last_ip`, `status`, `created_at`, `updated_at`)
VALUES
	(1,'admin','admin','$2b$06$YcuheT8cFTWbbmaBQ13neOnSSP3C8zt8XMIGmBWXNAsJ36PuK/i9W','程耀','18510255608','中国北京','127.0.0.1',1,'2021-05-08 18:34:04','2021-05-17 18:19:14')

/*!40000 ALTER TABLE `account` ENABLE KEYS */;
UNLOCK TABLES;


# 转储表 account_company
# ------------------------------------------------------------

DROP TABLE IF EXISTS `account_company`;

CREATE TABLE `account_company` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `account_id` int(11) unsigned NOT NULL COMMENT '账号id',
  `company_id` int(11) unsigned NOT NULL COMMENT '企业ID',
  PRIMARY KEY (`id`),
  KEY `account_id` (`account_id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `account_company_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`) ON DELETE CASCADE,
  CONSTRAINT `account_company_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='账号绑定企业';



# 转储表 account_log
# ------------------------------------------------------------

DROP TABLE IF EXISTS `account_log`;

CREATE TABLE `account_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` tinyint(4) DEFAULT '1' COMMENT '类型，1=登录，2=修改密码',
  `account_id` int(11) unsigned DEFAULT NULL COMMENT '账号ID',
  `created_at` datetime DEFAULT NULL COMMENT '时间',
  PRIMARY KEY (`id`),
  KEY `account_id` (`account_id`),
  CONSTRAINT `account_log_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;



# 转储表 category
# ------------------------------------------------------------

DROP TABLE IF EXISTS `category`;

CREATE TABLE `category` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL DEFAULT '' COMMENT '分类名称',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态，1=开启，0=禁用',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='设备分类';



# 转储表 company
# ------------------------------------------------------------

DROP TABLE IF EXISTS `company`;

CREATE TABLE `company` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL DEFAULT '' COMMENT '公司名称',
  `name` varchar(32) DEFAULT '' COMMENT '联系人',
  `phone` varchar(32) DEFAULT '' COMMENT '联系电话',
  `status` tinyint(4) DEFAULT NULL COMMENT '状态',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公司信息';



# 转储表 delivery
# ------------------------------------------------------------

DROP TABLE IF EXISTS `delivery`;

CREATE TABLE `delivery` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` int(11) unsigned DEFAULT NULL COMMENT '企业ID',
  `name` varchar(32) NOT NULL DEFAULT '' COMMENT '姓名',
  `phone` varchar(32) NOT NULL DEFAULT '' COMMENT '电话',
  `status` tinyint(4) NOT NULL DEFAULT '1' COMMENT '状态，0=禁用，1=开启',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  KEY `status` (`status`),
  CONSTRAINT `delivery_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='送货人信息表';



# 转储表 order
# ------------------------------------------------------------

DROP TABLE IF EXISTS `order`;

CREATE TABLE `order` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int(11) unsigned DEFAULT NULL COMMENT '设备类型',
  `desc` varchar(255) DEFAULT NULL COMMENT '需求描述',
  `agent` varchar(32) DEFAULT NULL COMMENT '经办人',
  `account_id` int(11) unsigned DEFAULT NULL COMMENT '接收账号ID',
  `check_user_id` int(11) unsigned DEFAULT NULL COMMENT '审批人ID',
  `check` varchar(32) DEFAULT NULL COMMENT '审批人',
  `user_id` int(11) unsigned DEFAULT NULL COMMENT '使用人ID',
  `company_id` int(11) unsigned DEFAULT NULL COMMENT '供货商ID',
  `product_id` int(11) unsigned DEFAULT NULL COMMENT '产品ID',
  `delivery_id` int(11) unsigned DEFAULT NULL COMMENT '送货人ID',
  `ticket_id` int(11) unsigned DEFAULT NULL COMMENT '发票ID',
  `number` int(11) DEFAULT '1' COMMENT '数量',
  `price` decimal(10,2) DEFAULT '0.00' COMMENT '单价',
  `money` decimal(10,2) DEFAULT '0.00' COMMENT '金额',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `use_at` datetime DEFAULT NULL COMMENT '使用时间',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态',
  `supplied_at` datetime DEFAULT NULL COMMENT '供货时间',
  `final_at` datetime DEFAULT NULL COMMENT '结算时间',
  `created_at` datetime DEFAULT NULL COMMENT '下单时间',
  `updated_at` datetime DEFAULT NULL COMMENT '最后更新时间',
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `account_id` (`account_id`),
  KEY `check_user_id` (`check_user_id`),
  KEY `company_id` (`company_id`),
  KEY `product_id` (`product_id`),
  KEY `delivery_id` (`delivery_id`),
  KEY `user_id` (`user_id`),
  KEY `ticket_id` (`ticket_id`),
  CONSTRAINT `order_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`),
  CONSTRAINT `order_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`),
  CONSTRAINT `order_ibfk_3` FOREIGN KEY (`check_user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `order_ibfk_4` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`),
  CONSTRAINT `order_ibfk_5` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`),
  CONSTRAINT `order_ibfk_6` FOREIGN KEY (`delivery_id`) REFERENCES `delivery` (`id`),
  CONSTRAINT `order_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
  CONSTRAINT `order_ibfk_8` FOREIGN KEY (`ticket_id`) REFERENCES `ticket` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单';



# 转储表 order_log
# ------------------------------------------------------------

DROP TABLE IF EXISTS `order_log`;

CREATE TABLE `order_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int(11) unsigned NOT NULL COMMENT '订单ID',
  `account_id` int(11) unsigned NOT NULL COMMENT '账号ID',
  `desc` varchar(255) DEFAULT '' COMMENT '操作描述',
  `created_at` datetime DEFAULT NULL COMMENT '时间',
  PRIMARY KEY (`id`),
  KEY `order_id` (`order_id`),
  KEY `account_id` (`account_id`),
  CONSTRAINT `order_log_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `order` (`id`),
  CONSTRAINT `order_log_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `account` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单操作日志';



# 转储表 product
# ------------------------------------------------------------

DROP TABLE IF EXISTS `product`;

CREATE TABLE `product` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `category_id` int(11) unsigned NOT NULL COMMENT '设备类型ID',
  `name` varchar(255) NOT NULL DEFAULT '' COMMENT '商品名称',
  `params` text COMMENT '参数',
  `unit` varchar(10) NOT NULL DEFAULT '' COMMENT '规格',
  `price` decimal(10,2) NOT NULL DEFAULT '0.00' COMMENT '单价',
  `company_id` int(11) unsigned NOT NULL COMMENT '供货商ID',
  `link` varchar(255) DEFAULT NULL COMMENT '卖场链接',
  `status` tinyint(4) DEFAULT NULL COMMENT '状态，0=禁用，1=开启',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='产品信息';



# 转储表 ticket
# ------------------------------------------------------------

DROP TABLE IF EXISTS `ticket`;

CREATE TABLE `ticket` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company_id` int(11) unsigned NOT NULL COMMENT '公司ID',
  `code` varchar(32) NOT NULL DEFAULT '' COMMENT '发票代码',
  `number` varchar(32) NOT NULL DEFAULT '' COMMENT '发票号码',
  `date` datetime NOT NULL COMMENT '开票日期',
  `money` decimal(10,2) NOT NULL COMMENT '开票金额',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '修改时间',
  `status` tinyint(4) DEFAULT '1' COMMENT '状态',
  PRIMARY KEY (`id`),
  KEY `company_id` (`company_id`),
  CONSTRAINT `ticket_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `company` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='发票信息';



# 转储表 user
# ------------------------------------------------------------

DROP TABLE IF EXISTS `user`;

CREATE TABLE `user` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(32) NOT NULL DEFAULT '' COMMENT '姓名',
  `address` varchar(255) DEFAULT NULL COMMENT '地址',
  `department` varchar(255) DEFAULT NULL COMMENT '部门',
  `phone` varchar(32) DEFAULT NULL COMMENT '电话',
  `status` tinyint(4) DEFAULT NULL COMMENT '状态',
  `created_at` datetime DEFAULT NULL COMMENT '创建时间',
  `updated_at` datetime DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='使用人';




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
