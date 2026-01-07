import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineTransportModel(sequelize: Sequelize) {
    class Transport extends Model {
        public id!: number;
        public name?: string;
        public code?: string;
        public created_on?: Date;
        public is_deleted?: boolean;
    }

    Transport.init(
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
            sector: {
                type: DataTypes.STRING(255),
                allowNull: true,
            },
            code: {
                type: DataTypes.STRING(100),
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
            modelName: "Transport",
            tableName: "transport",
            schema: "greensight_scope1",
            timestamps: false,
        }
    );

    return Transport;
}
