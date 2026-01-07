import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineLocationModel(sequelize: Sequelize) {
    class Location extends Model {
        public id!: number;
        public name?: string;
        public latitude?: number;
        public longitude?: number;
        public created_on?: Date;
        public is_deleted?: boolean;
    }

    Location.init(
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
            latitude: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            longitude: {
                type: DataTypes.FLOAT,
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
            modelName: "Location",
            tableName: "location",
            schema: "greensight_scope1",
            timestamps: false,
        }
    );

    return Location;
}
