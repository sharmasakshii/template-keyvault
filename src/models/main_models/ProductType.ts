import { Sequelize, DataTypes, Model } from "sequelize";
import { commonFields } from "../commonModelAttributes/comonField";

export default function defineProductTypeModel(sequelize: Sequelize) {
    class ProductType extends Model {
        public id!: number;
        public uuid!: string;
        public code!: string;
        public name!: string;
        public created_on!: Date;
        public created_by!: string;
        public modified_on!: Date | null;
        public modified_by!: string | null;
        public is_deleted!: boolean;
        public impact_fraction!: number;
        public cost_premium_const!: number;
        public is_access!: string | null;
        public created_at!: Date;
        public updated_at!: Date;
    }

    ProductType.init(
        {
            ...commonFields.productType,

            is_access: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "ProductType",
            tableName: "product_type",
            timestamps: true, // Enables created_at and updated_at
            createdAt: "created_at",
            updatedAt: "updated_at",
        }
    );

    return ProductType;
}
