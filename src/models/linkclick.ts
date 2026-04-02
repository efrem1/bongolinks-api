'use strict';
import {Sequelize, Model} from 'sequelize';

module.exports = (sequelize: Sequelize, DataTypes: any) => {
    class LinkClick extends Model {
        static associate(models: any) {
            LinkClick.belongsTo(models.Link);
            LinkClick.belongsTo(models.User);
        }
    }
    LinkClick.init({
        LinkId: DataTypes.INTEGER,
        UserId: DataTypes.INTEGER,
        ip: DataTypes.STRING,
        userAgent: DataTypes.STRING,
        referrer: DataTypes.STRING,
        country: DataTypes.STRING,
        timestamp: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    }, {
        sequelize,
        modelName: 'LinkClick',
    });
    return LinkClick;
};
