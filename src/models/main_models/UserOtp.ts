import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineUserOtpModel(sequelize: Sequelize) {
    class UserOtp extends Model {
        public user_id!: number;
        public otp!: string;
        public status!: number;
        public attempts!: number;
        public createdAt!: Date;
        public updatedAt!: Date;
    }

    UserOtp.init(
        {
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            otp: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            status: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            attempts: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: "UserOtp",
            tableName: "user_otps",
            timestamps: true, 
        }
    );

    return UserOtp;
}
