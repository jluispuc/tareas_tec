CREATE DATABASE `api_works`;

use `api_works`;

CREATE TABLE IF NOT EXISTS `works`(
	`id` INT(11) UNSIGNED AUTO_INCREMENT NOT NULL,
    `name` VARCHAR(255) DEFAULT NULL,
    `ready` TINYINT(1) DEFAULT NULL COMMENT '1 -> realizado, 0 -> no realizado',
    PRIMARY KEY (`id`)
)ENGINE=InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 