import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineProductTypeModel(sequelize: Sequelize) {
  class ProductType extends Model {
    public id!: number;
    public name!: string;
    public code!: string;
    public is_deleted!: boolean;
    public color_code!: string | null;
  }

  ProductType.init(
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
      code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      color_code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'product_type',
      schema: 'greensight_scope1',
      timestamps: false, // Disable createdAt and updatedAt fields
    }
  );

  return ProductType;
}
