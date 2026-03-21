'use strict';
import { Sequelize,Model } from 'sequelize';
module.exports = (sequelize:Sequelize, DataTypes:any) => {
  class OauthRefreshToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models:any) {
      OauthRefreshToken.belongsTo(models.OauthAccessToken)
    }
  }
  OauthRefreshToken.init({
    access_token_id: DataTypes.INTEGER,
    token: {
      type: DataTypes.STRING,
      unique: true,
    },
    revoked: {
      type: DataTypes.INTEGER,
      defaultValue: false,
      allowNull: false,
    },
    expires_at: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'OauthRefreshToken',
    underscored: true,
  });
  return OauthRefreshToken;
};
