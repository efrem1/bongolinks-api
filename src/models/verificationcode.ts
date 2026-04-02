'use strict';

import {Sequelize, Model} from 'sequelize';

module.exports = (sequelize: Sequelize, DataTypes: any) => {
    class VerificationCode extends Model {
        static associate(models: any) {
            // Association if needed, but identifier can be email or phone
        }
    }

    VerificationCode.init({
        identifier: {
            type: DataTypes.STRING,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'VerificationCode',
    });
    return VerificationCode;
};
