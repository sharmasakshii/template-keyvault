import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineCompany(sequelize: Sequelize) {
  class Company extends Model {
    public id!: number;
    public name!: string;
    public created_on!: Date;
    public is_deleted!: boolean;
  }

  Company.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_on: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Company',
      tableName: 'company',
      schema: 'greensight_scope1',  // Specify the schema
      timestamps: false,  // No createdAt/updatedAt fields
    }
  );

  return Company;
}
