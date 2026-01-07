import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineScopeOnboardingAnswersModel(sequelize: Sequelize) {
    class ScopeOnboardingAnswers extends Model {
        public scope_question_id!: number | null;
        public option_id!: number | null;
        public scope_id!: number | null;
        public company_id!: number | null;
        public answer_text!: string | null;
    }

    ScopeOnboardingAnswers.init(
        {
            scope_question_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            option_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            scope_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            company_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            answer_text: {
                type: DataTypes.TEXT, // Equivalent to nvarchar(MAX) in Sequelize
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "ScopeOnboardingAnswers",
            tableName: "scope_onboarding_answers",
            timestamps: false, // Disable timestamps
        }
    );

  

    return ScopeOnboardingAnswers;
}
