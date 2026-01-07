import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineLaneEvDistanceModel(sequelize: Sequelize) {
    class LaneEvDistance extends Model {
        public id!: number;
        public lane_id!: number | null;
        public k_count!: number | null;
        public Latitude!: number | null;
        public Longitude!: number | null;
        public fuel_stop_id!: number | null;
        public distance!: number | null;
        public th_distance!: number | null;
    }

    LaneEvDistance.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            lane_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
            k_count: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            Latitude: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            Longitude: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            fuel_stop_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            distance: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            th_distance: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "LaneEvDistance",
            tableName: "lane_ev_distance",
            timestamps: false, // Disable timestamps
        }
    );

    return LaneEvDistance;
}
