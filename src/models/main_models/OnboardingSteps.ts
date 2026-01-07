import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineOnboardingStepsModel(sequelize: Sequelize) {
    class OnboardingSteps extends Model {
        public name?: string;
        public code?: string;
        public scope_id?: number;
    }

    OnboardingSteps.init(
        {
            name: {
                type: DataTypes.STRING(255), // Equivalent to nvarchar(255) in SQL Server
                allowNull: true,
            },
            code: {
                type: DataTypes.STRING(100), // Equivalent to nvarchar(100) in SQL Server
                allowNull: true,
            },
            scope_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "OnboardingSteps",
            tableName: "onboardig_steps",
            timestamps: false, // Disable createdAt and updatedAt
        }
    );

    return OnboardingSteps;
}
