import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineFuelReport(sequelize: Sequelize) {
  class FuelReport extends Model {
    public id!: number;
    public business_unit_id!: number;
    public market_id!: number;
    public company_id!: number;
    public transactions!: string;
    public location_id!: number;
    public fuel_type_id!: number;
    public gallons!: number;
    public price_per_gallon!: number;
    public fuel_cost_at_pump!: number;
    public transport_id!: number;
    public transport_code!: string;
    public transport_code_3!: string;
    public division_id!: number;
    public month!: number;
    public year!: number;
    public period_id!: number;
  }

  FuelReport.init(
    {
      
      business_unit_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      market_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      transactions: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      fuel_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      gallons: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      emissions: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      price_per_gallon: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      fuel_cost_at_pump: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      transport_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      transport_code: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      transport_code_3: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      division: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      period_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'FuelReport',
      tableName: 'fuel_report',
      schema: 'greensight_scope1',
      timestamps: false,
    }
  );

  return FuelReport;
}
