import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineCompanyModel(sequelize: Sequelize) {
    class Company extends Model {
        public name!: string;
        public db_alias!: string;
        public slug!: string;
        public logo!: string;
        public status!: number;
        public is_onboarded!: boolean;
    }

    Company.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            db_alias: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            slug: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            logo: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            is_onboarded: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "Company",
            tableName: "company",
            timestamps: false, // No createdAt/updatedAt fields
        }
    );

    return Company;
}
