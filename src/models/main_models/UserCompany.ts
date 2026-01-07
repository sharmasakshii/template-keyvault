import { Sequelize, DataTypes, Model } from "sequelize";


export default function defineUserCompanyModel(sequelize: Sequelize) {
    class UserCompany extends Model {
        public company_id!: number;
        public user_id!: number;
    }

    UserCompany.init(
        {
            company_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "company", // name of the target model
                    key: "id", // key in the target model
                },
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users", // name of the target model
                    key: "id", // key in the target model
                },
            },
        },
        {
            sequelize,
            modelName: "UserCompany",
            tableName: "user_company",
            timestamps: false, // Since there are no createdAt/updatedAt fields
        }
    );

    // Define associations


    return UserCompany;
}
