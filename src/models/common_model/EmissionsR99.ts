import { Sequelize, Model, DataTypes } from "sequelize";

export default function defineEmissionsR99Model(sequelize: Sequelize) {
  class EmissionsR99 extends Model {
    public id!: number; // Primary key
    public country_id!: number | null; // Foreign key for country
    public sector_id!: number | null; // Foreign key for sector
    public bu_id!: number | null; // Foreign key for business unit
    public fuel_id!: number; // Foreign key for fuel
    public location_id!: number | null; // Foreign key for location
    public fuel_consumption!: number | null; // Fuel consumption value
    public vehicle_id!: number | null; // Vehicle identifier
    public department!: number | null; // Department value
    public driver_name!: string | null; // Name of the driver
    public transaction_date!: Date | null; // Date of record
    public created_on!: Date | null; // Timestamp for creation
    public modified_on!: Date | null; // Timestamp for modification
  }

  EmissionsR99.init(
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
      fuel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      fuel_consumption: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      vehicle_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      department: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      driver_name: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      transaction_date: {
        type: DataTypes.DATEONLY,
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
    },
    {
      sequelize,
      modelName: "EmissionsR99", // Logical name of the model
      tableName: "emissions_r99", // Actual table name in the database
      schema: "greensight_scope1", // Schema for the table
      timestamps: false, // Disable Sequelize's default timestamps
    }
  );

  return EmissionsR99;
}
