import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineUserActivityModel(sequelize: Sequelize) {
    class UserActivity extends Model {
        public id!: number;
        public user_id!: number;
        public login_at!: Date;
    }

    UserActivity.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            login_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "UserActivity",
            tableName: "user_activity",
            timestamps: false,
        }
    );

    return UserActivity;
}
