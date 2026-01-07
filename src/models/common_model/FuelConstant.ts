import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineFuelConstant(sequelize: Sequelize) {
  class FuelConstant extends Model {
    public id!: number;
    public name!: string;
    public constant!: number;
    public created_on!: Date;
    public modified_on!: Date;
  }

  FuelConstant.init(
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
      constant: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      created_on: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      modified_on: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'FuelConstant',
      tableName: 'fuel_constant',
      schema: 'greensight_scope1',
      timestamps: false,
    }
  );

 

  return FuelConstant;
}
