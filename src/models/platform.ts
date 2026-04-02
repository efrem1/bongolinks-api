'use strict';

import {Sequelize, Model} from 'sequelize';

module.exports = (sequelize: Sequelize, DataTypes: any) => {
    class Platform extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            // define association here
            Platform.belongsToMany(models.User, { through: 'UserPlatform' });
        }
    }

    Platform.init({
        name: DataTypes.STRING,
        logo: DataTypes.STRING,
        color: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Platform',
    });
    return Platform;
};