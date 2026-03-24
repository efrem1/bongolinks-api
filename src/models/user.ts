'use strict';

import {Sequelize, Model} from 'sequelize';

module.exports = (sequelize: Sequelize, DataTypes: any) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            User.belongsToMany(models.Platform, { through: 'UserPlatform' });
            User.belongsTo(models.UserCategory);
        }
    }

    User.init({
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        username: {
            type: DataTypes.STRING,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        verificationToken: {
            type: DataTypes.TEXT,
        },
        onBoarded: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,

        },
        bio: {
            type: DataTypes.TEXT
        }
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};