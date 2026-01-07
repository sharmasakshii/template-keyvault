import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineFuelSubType(sequelize: Sequelize) {
  class FuelSubType extends Model {
    public id!: number;
    public fuel_id!: number;
    public name!: string;
    public created_on!: Date | null;
    public modified_on!: Date | null;
    public fuel_sub_type_id!: number | null;
  }

  FuelSubType.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      fuel_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_on: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      modified_on: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      fuel_sub_type_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'FuelSubType',
      tableName: 'fuel_sub_type',
      schema: 'greensight_scope1',
      timestamps: false, // No createdAt/updatedAt fields
    }
  );

  

  return FuelSubType;
}
