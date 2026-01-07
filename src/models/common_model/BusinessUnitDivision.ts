import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineBusinessUnitDivision(sequelize: Sequelize) {
  class BusinessUnitDivision extends Model {
    public id!: number;
    public name!: string;
  }

  BusinessUnitDivision.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'BusinessUnitDivision',
      tableName: 'business_unit_division',
      timestamps: false,
    }
  );

  return BusinessUnitDivision;
}
