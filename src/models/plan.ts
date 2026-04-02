'use strict';
import {Sequelize, Model} from 'sequelize';

module.exports = (sequelize: Sequelize, DataTypes: any) => {
    class Plan extends Model {
        static associate(models: any) {
            Plan.belongsToMany(models.Feature, { through: 'PlanFeatures' });
            Plan.hasMany(models.Subscription);
        }
    }
    Plan.init({
        name: DataTypes.STRING,
        price: DataTypes.DECIMAL(10, 2),
        googlePayPriceId: DataTypes.STRING,
        type: DataTypes.ENUM('free', 'premium')
    }, {
        sequelize,
        modelName: 'Plan',
    });
    return Plan;
};
