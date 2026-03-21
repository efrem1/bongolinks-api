import {sequelize} from '../models';
import logger from '../middlewares/logging';

sequelize.sync({force: false})
    .then(() => {
        logger.info('Data base synchronization successfully');
    })
    .catch((err: Error) => {
        logger.info(`Failed to synchronize the database because of ${err.message}`);
    })


