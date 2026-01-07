import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineAlternateFuelTypeConstant(sequelize: Sequelize) {
  class AlternateFuelTypeConstant extends Model {
    public id!: number;
    public name!: string;
    public code!: string;
    public fuel_constant!: number;
  }

  AlternateFuelTypeConstant.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fuel_constant: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'AlternateFuelTypeConstant',
      tableName: 'alternate_fueltype_constant',
      timestamps: false,
    }
  );

  return AlternateFuelTypeConstant;
}
