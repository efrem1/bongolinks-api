'use strict';
import {Sequelize, Model} from 'sequelize';

module.exports = (sequelize: Sequelize, DataTypes: any) => {
    class Feature extends Model {
        static associate(models: any) {
            Feature.belongsToMany(models.Plan, { through: 'PlanFeatures' });
        }
    }
    Feature.init({
        name: DataTypes.STRING,
        key: {
            type: DataTypes.STRING,
            unique: true
        },
        description: DataTypes.TEXT
    }, {
        sequelize,
        modelName: 'Feature',
    });
    return Feature;
};
