import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineFuelLocation(sequelize: Sequelize) {
  class FuelLocation extends Model {
    public id!: number;
    public name!: string;
    public latitude!: number | null;
    public longitude!: number | null;
    public created_on!: Date | null;
    public modified_on!: Date | null;
  }

  FuelLocation.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      latitude: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      longitude: {
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
    },
    {
      sequelize,
      modelName: 'FuelLocation',
      tableName: 'fuel_location',
      schema: 'greensight_scope1',
      timestamps: false,
    }
  );

 

  return FuelLocation;
}
