import { Sequelize, DataTypes, Model } from "sequelize";


export default function defineUserPasswordLogModel(sequelize: Sequelize) {
    class UserPasswordLog extends Model {
        public user_id!: number;
        public old_password!: string;
        public created_at!: Date;
    }

    UserPasswordLog.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            old_password: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        },
        {
            sequelize,
            modelName: "UserPasswordLog",
            tableName: "user_password_logs",
            timestamps: false, // Disable automatic timestamps
        }
    );

    // Define associations


    return UserPasswordLog;
}
