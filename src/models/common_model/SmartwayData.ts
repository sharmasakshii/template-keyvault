import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineSmartwayData(sequelize: Sequelize) {
  class SmartwayData extends Model {
    public carrier_name!: string;
    public code!: string;
    public platform_mode!: string;
    public intensity!: number;
    public year!: number;
    public ranking!: number;
  }

  SmartwayData.init(
    {
      carrier_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      platform_mode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      intensity: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      ranking: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'SmartwayData',
      tableName: 'smartway_data',
      timestamps: false, // Assuming no timestamps for this table
    }
  );

  

  return SmartwayData;
}
