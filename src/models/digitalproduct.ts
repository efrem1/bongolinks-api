'use strict';
import {Sequelize, Model} from 'sequelize';

module.exports = (sequelize: Sequelize, DataTypes: any) => {
    class DigitalProduct extends Model {
        static associate(models: any) {
            DigitalProduct.belongsTo(models.User);
            DigitalProduct.hasMany(models.Order);
        }
    }
    DigitalProduct.init({
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        price: DataTypes.DECIMAL(10, 2),
        fileUrl: DataTypes.STRING,
        UserId: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'DigitalProduct',
    });
    return DigitalProduct;
};
