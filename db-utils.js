import db from './db.js'

export const getMySQLDate = (date) => {
  date = date.getUTCFullYear() + '-' +
    ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
    ('00' + date.getUTCDate()).slice(-2) + ' ' +
    ('00' + date.getUTCHours()).slice(-2) + ':' +
    ('00' + date.getUTCMinutes()).slice(-2) + ':' +
    ('00' + date.getUTCSeconds()).slice(-2);
  return date;
};

export const getReadableDateString = (date) => {
  return ('00' + date.getDate()).slice(-2) + '/' +
         ('00' + (date.getMonth()+1)).slice(-2) + '/' +
         date.getFullYear() + ' às ' +
         ('00' + date.getHours()).slice(-2) + ':' +
         ('00' + date.getMinutes()).slice(-2) + ':' +
         ('00' + date.getSeconds()).slice(-2);
}

export const resetDb = async () => {
  
  const transaction = await db.getConnection()
  try {
    await transaction.beginTransaction()
    
    await transaction.query('SET FOREIGN_KEY_CHECKS = 0;')
    await transaction.query('TRUNCATE TABLE `zombies`.`person`;')
    await transaction.query('TRUNCATE TABLE `zombies`.`zombie`;')
    
    await transaction.query('SET FOREIGN_KEY_CHECKS = 1;')
    await transaction.query("INSERT INTO `zombies`.`zombie` (`id`, `name`, `born`, `previousName`, `pictureUrl`, `bittenBy`) VALUES (NULL, 'Zeshua', '1971-01-01 00:00:00', 'desconhecido', 'zombie1.jpg', NULL); INSERT INTO `zombies`.`zombie` (`id`, `name`, `born`, `previousName`, `pictureUrl`, `bittenBy`) VALUES (NULL, 'Zileide', '1990-02-27 04:24:09', 'Gisleide Caetano', 'zombie2.jpg', 1);INSERT INTO `zombies`.`zombie` (`id`, `name`, `born`, `previousName`, `pictureUrl`, `bittenBy`) VALUES (NULL, 'Zaratustra', '1991-04-18 20:03:22', 'Sara Tustra', 'zombie3.jpg', 1); INSERT INTO `zombies`.`zombie` (`id`, `name`, `born`, `previousName`, `pictureUrl`, `bittenBy`) VALUES (NULL, 'Zinho', '1995-12-13 23:33:10', 'Jose Plinio', 'zombie4.jpg', 1); INSERT INTO `zombies`.`zombie` (`id`, `name`, `born`, `previousName`, `pictureUrl`, `bittenBy`) VALUES (NULL, 'Zelestor', '2001-11-09 05:23:19', 'Adamastor Pinheiro', 'zombie5.jpg', 3); INSERT INTO `zombies`.`zombie` (`id`, `name`, `born`, `previousName`, `pictureUrl`, `bittenBy`) VALUES (NULL, 'Zocrato', '2014-09-24 22:59:55', 'Socrates Sangalo', 'zombie6.jpg', 4);")
    await transaction.query("INSERT INTO `zombies`.`person` (`id`, `name`, `alive`, `eatenBy`) VALUES (NULL, 'Adalberto Silva', 1, NULL);  INSERT INTO `zombies`.`person` (`id`, `name`, `alive`, `eatenBy`) VALUES (NULL, 'Justiniano Ferreira', 1, NULL);  INSERT INTO `zombies`.`person` (`id`, `name`, `alive`, `eatenBy`) VALUES (NULL, 'Ariosvaldo Pereira', 1, NULL);  INSERT INTO `zombies`.`person` (`id`, `name`, `alive`, `eatenBy`) VALUES (NULL, 'Warley Damasceno', 0, 1);  INSERT INTO `zombies`.`person` (`id`, `name`, `alive`, `eatenBy`) VALUES (NULL, 'Arlete Prada', 1, NULL);  INSERT INTO `zombies`.`person` (`id`, `name`, `alive`, `eatenBy`) VALUES (NULL, 'Herminio Aleixo', 1, NULL);  INSERT INTO `zombies`.`person` (`id`, `name`, `alive`, `eatenBy`) VALUES (NULL, 'Osorio Oliveira', 0, 3);")
    await transaction.commit()
    
  } catch (error) {
    console.error(error)
    error.friendlyMessage = 'Não foi possível restaurar o banco';
    await transaction.rollback()
    throw error
  } finally {
    transaction.release()
  }
}
