'use strict';
import {Sequelize, Model} from 'sequelize';

module.exports = (sequelize: Sequelize, DataTypes: any) => {
    class PlanFeature extends Model {
        static associate(models: any) {
            PlanFeature.belongsTo(models.Plan);
            PlanFeature.belongsTo(models.Feature);
        }
    }
    PlanFeature.init({
        PlanId: DataTypes.INTEGER,
        FeatureId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'PlanFeature',
    });
    return PlanFeature;
};
