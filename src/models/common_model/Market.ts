import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineMarketModel(sequelize: Sequelize) {
    class Market extends Model {
        public id!: number;
        public name?: string;
        public description?: string;
        public created_on?: Date;
        public is_deleted?: boolean;
    }

    Market.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            created_on: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Market",
            tableName: "market",
            schema: "greensight_scope1",  // Specify the schema
            timestamps: false,  // No createdAt/updatedAt fields
        }
    );

    return Market;
}
