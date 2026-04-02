'use strict';
import {Sequelize, Model} from 'sequelize';

module.exports = (sequelize: Sequelize, DataTypes: any) => {
    class Order extends Model {
        static associate(models: any) {
            Order.belongsTo(models.User);
            Order.belongsTo(models.DigitalProduct);
        }
    }
    Order.init({
        UserId: DataTypes.INTEGER,
        DigitalProductId: DataTypes.INTEGER,
        status: DataTypes.STRING,
        paymentIntentId: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Order',
    });
    return Order;
};
