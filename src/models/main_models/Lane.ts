import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineLaneModel(sequelize: Sequelize) {
    class Lane extends Model {
        public name!: string;
    }

    Lane.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false, // You may add this constraint if name should be required
            },
        },
        {
            sequelize,
            modelName: "Lane",
            tableName: "lane",
            timestamps: false, // Disable timestamps if not required
        }
    );

    return Lane;
}
