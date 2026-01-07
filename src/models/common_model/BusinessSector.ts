import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineBusinessSector(sequelize: Sequelize) {
  class BusinessSector extends Model {
    public id!: number;
    public name!: string;
    public code!: string;
    public created_on!: Date;
    public modified_on!: Date | null;
    public country_id!: number;

  }

  BusinessSector.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_on: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      modified_on: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      country_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'BusinessSector',
      tableName: 'business_sector',
      schema: 'greensight_scope1',
      timestamps: false,
    }
  );


  return BusinessSector;
}
