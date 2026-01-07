import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineAIAgentChatHistoryModel(sequelize: Sequelize) {
    class AIAgentChatHistory extends Model {
        public id!: number;
        public question!: string | null;
        public response!: string | null;
        public response_type!: string | null;
        public title_slug!: string;
        public user_id!: number | null;
        public date!: Date | null;
        public is_deleted!: boolean | null;
    }

    AIAgentChatHistory.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            question: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            response: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            response_type: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            title_slug: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            data: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
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
            status: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "AIAgentChatHistory",
            tableName: "ai_agent_chat_history",
            timestamps: false,
        }
    );

    return AIAgentChatHistory;
}
