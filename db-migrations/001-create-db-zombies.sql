SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema zombies
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `zombies` ;
CREATE SCHEMA IF NOT EXISTS `zombies` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `zombies` ;

-- -----------------------------------------------------
-- Table `zombies`.`zombie`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `zombies`.`zombie` ;

CREATE TABLE IF NOT EXISTS `zombies`.`zombie` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `born` DATETIME NULL,
  `previousName` VARCHAR(45) NULL,
  `pictureUrl` VARCHAR(200) NULL,
  `bittenBy` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_zombie_bittenBy_idx` (`bittenBy` ASC),
  CONSTRAINT `fk_zombie_bittenBy`
    FOREIGN KEY (`bittenBy`)
    REFERENCES `zombies`.`zombie` (`id`)
    ON DELETE SET NULL
    ON UPDATE SET NULL)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `zombies`.`person`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `zombies`.`person` ;

CREATE TABLE IF NOT EXISTS `zombies`.`person` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `alive` BOOLEAN NOT NULL DEFAULT 1,
  `eatenBy` INT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_person_eatenByZombie_idx` (`eatenBy` ASC),
  CONSTRAINT `fk_person_eatenByZombie`
    FOREIGN KEY (`eatenBy`)
    REFERENCES `zombies`.`zombie` (`id`)
    ON DELETE SET NULL
    ON UPDATE SET NULL)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
