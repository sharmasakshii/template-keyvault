import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineLaneRadiusConfigModel(sequelize: Sequelize) {
  class LaneRadiusConfig extends Model {
    public fuel_type!: string;
    public label!: string;
    public radius!: number;
  }

  LaneRadiusConfig.init(
    {
      fuel_type: {
        type: DataTypes.STRING(10),
        allowNull: false, // Add allowNull if necessary
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false, // Add allowNull if necessary
      },
      radius: {
        type: DataTypes.FLOAT,
        allowNull: false, // Add allowNull if necessary
      },
    },
    {
      sequelize,
      modelName: 'LaneRadiusConfig',
      tableName: 'lane_radius_config',
      timestamps: false,  // Set to true if you need timestamp fields (createdAt/updatedAt)
    }
  );

  return LaneRadiusConfig;
}
