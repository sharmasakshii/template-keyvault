import { Sequelize, Model, DataTypes } from "sequelize";

export default function defineFritoLayTransactionsModel(sequelize: Sequelize) {
  class FritoLayTransactions extends Model {
    public id!: number; // Primary key
    public country_id!: number | null; // Foreign key for country
    public sector_id!: number | null; // Foreign key for sector
    public bu_id!: number | null; // Foreign key for business unit
    public location_id!: number; // Foreign key for location
    public fuel_id!: number; // Foreign key for fuel
    public transaction_date!: Date | null; // Date of transaction
    public transaction_type!: string | null; // Type of transaction
    public fuel_consumption!: number | null; // Fuel consumption value
    public created_on!: Date | null; // Timestamp for creation
    public modified_on!: Date | null; // Timestamp for modification
    public vehicle_id!: string | null;
    public card_assignment!: string | null
  }

  FritoLayTransactions.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sector_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      bu_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      vehicle_id: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      card_assignment: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fuel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      transaction_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      transaction_type: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      fuel_consumption: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      created_on: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      modified_on: {
        type: DataTypes.DATE,
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
    },
    {
      sequelize,
      modelName: "FritoLayTransactions", // Logical name of the model
      tableName: "frito_lay_transactions", // Actual table name in the database
      schema: "greensight_scope1", // Schema for the table
      timestamps: false, // Disable Sequelize's default timestamps
    }
  );

  return FritoLayTransactions;
}
