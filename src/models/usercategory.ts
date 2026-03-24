'use strict';

import {Sequelize, Model} from 'sequelize';

module.exports = (sequelize: Sequelize, DataTypes: any) => {
    class UserCategory extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            // define association here

        }
    }

    UserCategory.init({
        title: DataTypes.STRING,
        icon: DataTypes.STRING,
        subtitle: DataTypes.TEXT,
    }, {
        sequelize,
        modelName: 'UserCategory',
    });
    return UserCategory;
};