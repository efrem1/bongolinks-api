'use strict';

import {Sequelize, Model} from 'sequelize';

module.exports = (sequelize: Sequelize, DataTypes: any) => {
    class SupportTicket extends Model {
        static associate(models: any) {
            SupportTicket.belongsTo(models.User);
            SupportTicket.hasMany(models.SupportTicketReply);
        }
    }

    SupportTicket.init({
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('open', 'in-progress', 'resolved', 'closed'),
            defaultValue: 'open',
            allowNull: false
        },
        priority: {
            type: DataTypes.ENUM('low', 'medium', 'high'),
            defaultValue: 'low',
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'SupportTicket',
    });
    return SupportTicket;
};
