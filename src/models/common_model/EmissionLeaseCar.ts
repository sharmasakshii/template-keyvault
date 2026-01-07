import { Sequelize, Model, DataTypes } from "sequelize";

export default function defineEmissionsLeasecarsModel(sequelize: Sequelize) {
  class EmissionsLeasecars extends Model {
    public id!: number; // Primary key
    public country_id!: number | null; // Foreign key for country
    public sector_id!: number | null; // Foreign key for sector
    public bu_id!: number | null; // Foreign key for business unit
    public fuel_id!: number; // Foreign key for fuel
    public fuel_consumption!: number | null; // Fuel consumption value
    public month!: number | null; // Month of record
    public year!: number | null; // Year of record
    public created_on!: Date | null; // Timestamp for creation
    public modified_on!: Date | null; // Timestamp for modification
  }

  EmissionsLeasecars.init(
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
      fuel_consumption: {
        type: DataTypes.FLOAT,
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
      modelName: "EmissionsLeasecars", // Logical name of the model
      tableName: "emissions_leasecars", // Actual table name in the database
      schema: "greensight_scope1", // Schema for the table
      timestamps: false, // Disable Sequelize's default timestamps
    }
  );

  return EmissionsLeasecars;
}
