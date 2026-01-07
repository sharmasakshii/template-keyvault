import { Sequelize, Model, DataTypes } from "sequelize";

export default function defineEmissionsPropaneModel(sequelize: Sequelize) {
  class EmissionsPropane extends Model {
    public id!: number; // Primary key
    public country_id!: number | null; // Foreign key for country
    public sector_id!: number | null; // Foreign key for sector
    public bu_id!: number | null; // Foreign key for business unit
    public location_id!: number | null; // Foreign key for location
    public fuel_id!: number; // Foreign key for fuel
    public fuel_consumption!: number | null; // Fuel consumption value
    public transaction_date!: Date | null; // Date of transaction
    public month!: number | null; // Month of record
    public year!: number | null; // Year of record
    public customer_name!: string | null; // Customer name
    public service_order!: string | null; // Service order
    public created_on!: Date | null; // Timestamp for creation
    public modified_on!: Date | null; // Timestamp for modification
  }

  EmissionsPropane.init(
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
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      fuel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fuel_consumption: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      transaction_date: {
        type: DataTypes.DATEONLY,
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
      customer_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      service_order: {
        type: DataTypes.STRING(100),
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
      modelName: "EmissionsPropane", // Logical name of the model
      tableName: "emissions_propane", // Actual table name in the database
      schema: "greensight_scope1", // Schema for the table
      timestamps: false, // Disable Sequelize's default timestamps
    }
  );

  return EmissionsPropane;
}
