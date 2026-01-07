import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineFailedLoginAttempt(sequelize: Sequelize) {
    class FailedLoginAttempt extends Model {
        public Attempt_On!: Date;
        public Last_Failure_Time!: Date;
        public user_id!: number;
    }

    FailedLoginAttempt.init(
        {

          
            UserID: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },

        },
        {
            sequelize,
            modelName: "FailedLoginAttempt",
            tableName: "failed_Login_Attempt",
            timestamps: false
        }
    );

    return FailedLoginAttempt;
}
