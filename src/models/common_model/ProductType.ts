import { Sequelize, DataTypes, Model } from 'sequelize';
import { commonFields } from '../commonModelAttributes/comonField';


export default function defineProductTypeModel(sequelize: Sequelize) {
  class ProductType extends Model {
    public id!: number;
    public uuid!: string;
    public code!: string;
    public name!: string;
    public created_on!: Date;
    public created_by!: string;
    public modified_on!: Date;
    public modified_by!: string;
    public is_deleted!: boolean;
    public impact_fraction!: number;
    public cost_premium_const!: number;
    public deleted_by!: string;
    public deleted_on!: Date;
    public created_at!: Date;
    public updated_at!: Date;
    public is_access!: boolean;
    public is_filterable!: boolean;
  }

  ProductType.init(
    {
      ...commonFields.productType,
      
      deleted_by: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      deleted_on: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      is_access: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      is_filterable: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'ProductType',
      tableName: 'product_type',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );


  return ProductType;
}
