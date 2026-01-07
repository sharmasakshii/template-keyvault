import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineReporting(sequelize: Sequelize) {
  class Reporting extends Model {
    public lane_id!: bigint | null;
    public lane_name!: string | null;
    public distance!: number | null;
    public fuel_type!: string | null;
    public fuel_code!: string | null;
    public emissions!: number | null;
    public impact_emissions!: number | null;
    public emission_reduction!: number | null;
    public radius_distance!: number | null;
    public division_id!: number | null;
    public year!: number | null;
    public quarter!: number | null;
    public time_id!: number | null;
  }

  Reporting.init(
    {
      lane_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      lane_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      distance: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      fuel_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      fuel_code: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      emissions: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      impact_emissions: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      emission_reduction: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      radius_distance: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      division_id: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true,
      },
      year: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      quarter: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      time_id: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Reporting',
      tableName: 'reporting',
      timestamps: false,          // Set to true if your table has createdAt and updatedAt columns
    }
  );

  return Reporting;
}
