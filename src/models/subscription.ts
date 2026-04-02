'use strict';
import {Sequelize, Model} from 'sequelize';

module.exports = (sequelize: Sequelize, DataTypes: any) => {
    class Subscription extends Model {
        static associate(models: any) {
            Subscription.belongsTo(models.User);
            Subscription.belongsTo(models.Plan);
        }
    }
    Subscription.init({
        UserId: DataTypes.INTEGER,
        PlanId: DataTypes.INTEGER,
        status: DataTypes.STRING,
        expiresAt: DataTypes.DATE
    }, {
        sequelize,
        modelName: 'Subscription',
    });
    return Subscription;
};
