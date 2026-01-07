import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineFuelReportPfna(sequelize: Sequelize) {
  class FuelReportPfna extends Model {
    public id!: number;
    public fuel_type_id!: number;
    public frct_consumption!: number;
    public act_consumption!: number;
    public period!: number;
    public year!: number;
    public frct_emissions!: number;
    public act_emissions!: number;
  }

  FuelReportPfna.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      fuel_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      frct_consumption: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      act_consumption: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      period_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      frct_emissions: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      act_emissions: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'FuelReportPfna',
      tableName: 'fuel_report_pfna',
      schema: 'greensight_scope1', // Specify the schema
      timestamps: false, // Since there are no createdAt/updatedAt fields
    }
  );

  return FuelReportPfna;
}
