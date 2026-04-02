'use strict';

import {Sequelize, Model} from 'sequelize';

module.exports = (sequelize: Sequelize, DataTypes: any) => {
    class SupportTicketReply extends Model {
        static associate(models: any) {
            SupportTicketReply.belongsTo(models.SupportTicket);
            SupportTicketReply.belongsTo(models.User);
        }
    }

    SupportTicketReply.init({
        SupportTicketId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        UserId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'SupportTicketReply',
    });
    return SupportTicketReply;
};
