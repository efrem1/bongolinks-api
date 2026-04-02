'use strict';
import {Sequelize, Model} from 'sequelize';

module.exports = (sequelize: Sequelize, DataTypes: any) => {
    class SocialAccount extends Model {
        static associate(models: any) {
            SocialAccount.belongsTo(models.User);
        }
    }
    SocialAccount.init({
        UserId: DataTypes.INTEGER,
        provider: DataTypes.STRING,
        accessToken: DataTypes.TEXT,
        refreshToken: DataTypes.TEXT,
        expiresAt: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'SocialAccount',
    });
    return SocialAccount;
};
