import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineDivisionModel(sequelize: Sequelize) {
    class Division extends Model {
        public id!: number;
        public name?: string;
        public description?: string;
        public created_on?: Date;
        public is_deleted?: boolean;
    }

    Division.init(
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
                type: DataTypes.STRING(1000),
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
            color: {
                type: DataTypes.STRING(100),
                allowNull: true,
              },
        },
        {
            sequelize,
            modelName: "Division",
            tableName: "division",
            schema: "greensight_scope1",
            timestamps: false,
        }
    );

    return Division;
}