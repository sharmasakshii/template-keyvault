import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineScopeQuestionModel(sequelize: Sequelize) {
    class ScopeQuestion extends Model {
        public question!: string | null;
        public step_id!: number | null;
        public type!: number | null;
        public is_required!: boolean | null;
    }

    ScopeQuestion.init(
        {
            question: {
                type: DataTypes.STRING, // Equivalent to nvarchar(MAX) in SQL Server
                allowNull: true,
            },
            step_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            type: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            is_required: {
                type: DataTypes.BOOLEAN, // bit is equivalent to BOOLEAN in Sequelize
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "ScopeQuestion",
            tableName: "scope_question",
            timestamps: false, // Disable timestamps
        }
    );

    // Define associations
    

    return ScopeQuestion;
}
