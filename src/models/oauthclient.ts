'use strict';
import { Sequelize,Model } from 'sequelize';
module.exports = (sequelize:Sequelize, DataTypes:any) => {
  class OauthClient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models:any) {
      // define association here
    }
  }
  OauthClient.init({
    name: DataTypes.STRING,
    secret: DataTypes.STRING,
    provider: DataTypes.STRING,
    redirect: DataTypes.STRING,
    personal_access_client: DataTypes.INTEGER,
    password_client: DataTypes.INTEGER,
    revoked: {
      type: DataTypes.INTEGER,
      defaultValue: false,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'OauthClient',
    underscored: true,
  });
  return OauthClient;
};
