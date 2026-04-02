'use strict';

import {Sequelize, Model} from 'sequelize';

module.exports = (sequelize: Sequelize, DataTypes: any) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models: any) {
            User.belongsToMany(models.Platform, { through: 'UserPlatform' });
            User.belongsTo(models.UserCategory);

            User.hasMany(models.Link);
            User.hasMany(models.SupportTicket);
            User.hasMany(models.SupportTicketReply);
            User.hasMany(models.VerificationCode, { foreignKey: 'identifier', sourceKey: 'whatsappNumber' });
            User.hasMany(models.Subscription);
            User.hasMany(models.Order);
            User.hasMany(models.DigitalProduct);
            User.hasMany(models.LinkClick);
        }
    }

    User.init({
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        username: {
            type: DataTypes.STRING,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
            validate: {
                isEmail: true,
            }
        },
        googleId: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true
        },
        verificationToken: {
            type: DataTypes.TEXT,
        },
        onBoarded: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,

        },
        whatsappNumber: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true
        },
        role: {
            type: DataTypes.ENUM('user', 'admin'),
            defaultValue: 'user',
            allowNull: false
        },
        bio: {
            type: DataTypes.TEXT
        },
        theme: {
            type: DataTypes.STRING,
            defaultValue: 'modern-glass'
        },
        bgColor: {
            type: DataTypes.STRING,
            defaultValue: '#030712'
        },
        accentColor: {
            type: DataTypes.STRING,
            defaultValue: '#8B5CF6'
        },
        fontFamily: {
            type: DataTypes.STRING,
            defaultValue: 'inter'
        },
        buttonStyle: {
            type: DataTypes.STRING,
            defaultValue: 'rounded-md'
        },
        buttonShadow: {
            type: DataTypes.STRING,
            defaultValue: 'none'
        },
        avatar: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        coverImage: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        viewsCount: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'User',
    });
    return User;
};
