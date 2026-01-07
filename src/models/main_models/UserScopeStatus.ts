import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineUserScopeStatusModel(sequelize: Sequelize) {
    class UserScopeStatus extends Model {
        public company_id?: number;
        public scope_id?: number;
        public step_code?: number;
        public is_completed?: boolean;
    }

    UserScopeStatus.init(
        {
            company_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            scope_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            step_code: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            is_completed: {
                type: DataTypes.BOOLEAN, // Maps to the SQL 'bit' type
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "UserScopeStatus",
            tableName: "user_scope_status",
            timestamps: false, // No createdAt/updatedAt fields
        }
    );

    return UserScopeStatus;
}
