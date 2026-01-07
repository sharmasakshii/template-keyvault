import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineLaneAlternateFuelTypeModel(sequelize: Sequelize) {
    class LaneAlternateFuelType extends Model {
        public id!: number;
        public lane_name?: string;
        public date?: Date;
        public fuel_type?: string;
        public scac?: string;
        public fuel_consumption?: number;
        public fuel_mileage?: number;
        public emission?: number;
        public month?: number;
        public year?: number;
        public updated_at?: Date;
        public is_deleted?: boolean;


    }

    LaneAlternateFuelType.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            lane_name: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            date: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            fuel_type: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            scac: {
                type: DataTypes.STRING(20),
                allowNull: true,
            },
            fuel_consumption: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            fuel_mileage: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: true,
            },
            emission: {
                type: DataTypes.DECIMAL(35, 10),
                allowNull: true,
            },
            shipments: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            month: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            updated_at: {
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
            modelName: "LaneAlternateFuelType",
            tableName: "lane_alternate_fueltype",
            timestamps: false,
        }
    );



    return LaneAlternateFuelType;
}
