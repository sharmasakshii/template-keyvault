import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineProductTypeAvailabilityModel(sequelize: Sequelize) {

    class ProductTypeAvailability
        extends Model {
        public id!: number;
        public product_type_id!: number;
        public created_by!: number | null;
        public created_on!: Date;
        public modified_by!: number | null;
        public modified_on!: Date | null;
    }

    ProductTypeAvailability.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            product_type_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            created_on: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,  // getdate()
            },
            modified_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            modified_on: {
                type: DataTypes.DATE,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'ProductTypeAvailability',
            tableName: 'product_type_availability',
            timestamps: false,
        }
    );

    return ProductTypeAvailability;
}
