import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineEmissionsBiodieselModel(sequelize: Sequelize) {
  class EmissionsBiodiesel extends Model {
    public id!: number;
    public country_id!: number;
    public sector_id!: number;
    public bu_id!: number;
    public location_id!: number;
    public fuel_id!: number;
    public fuel_consumption!: number;
    public vehicle_id!: number;
    public month!: number;
    public year!: number;
    public distance!: number;
    public created_on!: Date;
    public modified_on!: Date;
    public transaction_date!: Date;
  }

  EmissionsBiodiesel.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sector_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bu_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fuel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fuel_consumption: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      vehicle_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      distance: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      transaction_date : {
        type: DataTypes.DATE,
        allowNull: false,
      },
      created_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('GETDATE()'),
      },
      modified_on: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'emissions_biodiesel',
      schema: 'greensight_scope1',
      timestamps: false, // Disable createdAt and updatedAt fields
    }
  );

  return EmissionsBiodiesel;
}
