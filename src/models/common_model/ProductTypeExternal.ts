import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineProductTypeExternal(sequelize: Sequelize) {
    class ProductTypeExternal extends Model {
        public id!: number;
        public name!: string;
        public code!: string;
        public is_deleted!: boolean;
        public color_code!: string | null;
    }

    ProductTypeExternal.init(
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
        },
        {
            sequelize,
            tableName: 'product_type',
            modelName: 'ProductTypeExternal',
            timestamps: false, // Disable createdAt and updatedAt fields
        }
    );

    return ProductTypeExternal;
}
