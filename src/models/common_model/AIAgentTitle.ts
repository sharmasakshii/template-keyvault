import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineAIAgentTitleModel(sequelize: Sequelize) {
    class AIAgentTitle extends Model {
        public id!: number;
        public title!: string | null;
        public user_id!: number | null;
        public date!: Date | null;
        public is_deleted!: boolean | null;
        public slug!: string
    }

    AIAgentTitle.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            slug: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            date: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: true,
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: true,
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "AIAgentTitle",
            tableName: "ai_agent_title",
            timestamps: false,
        }
    );

    return AIAgentTitle;
}
