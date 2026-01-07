import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineLaneShipmentModel(sequelize: Sequelize) {
    class LaneShipment extends Model {
        public id!: number;
        public lane_name?: string;
        public scac?: string;
        public shipment?: number;
        public month?: number;
        public year?: number;
        public created_at?: Date;
        public updated_at?: Date;
        public is_deleted?: boolean;
    }

    LaneShipment.init(
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
            scac: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            fuel_type : {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            shipment: {
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
            created_at: {
                type: DataTypes.DATE,
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
            modelName: "LaneShipment",
            tableName: "lane_alternate_shipment",
        }
    );

    return LaneShipment;
}
