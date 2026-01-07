import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineUserTokenModel(sequelize: Sequelize) {
    class UserToken extends Model {
        public user_id!: number;
        public token!: string;
        public status!: number;
        public ut_id!: string;
        public logout_reason!: number;
        public is_logout!: boolean;
    }

    UserToken.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "users", // name of the target model
                    key: "id", // key in the target model
                },
            },
            token: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            ut_id: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            logout_reason: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            is_logout: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "UserToken",
            tableName: "user_token",
            timestamps: false, // If there are no createdAt/updatedAt fields
        }
    );

    // Define association

    return UserToken;
}
