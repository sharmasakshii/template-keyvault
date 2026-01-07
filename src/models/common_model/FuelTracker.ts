import { Sequelize, DataTypes, Model } from 'sequelize';


export default function defineFuelTracker(sequelize: Sequelize) {
  class FuelTracker extends Model {
    public id!: number;
    public sector_id!: number;
    public country_id!: number;
    public bu_id!: number;
    public fuel_id!: number;
    public gallons!: number;
    public period!: number | null;
    public year!: number;
    public month!: number | null;
  
  }

  FuelTracker.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      sector_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fuel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      gallons: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      period: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'FuelTracker',
      tableName: 'fuel_tracker',
      schema: 'greensight_scope1',
      timestamps: false, // No createdAt/updatedAt fields
    }
  );

  return FuelTracker;
}
