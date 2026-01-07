import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineLaneEvDetailsModel(sequelize: Sequelize) {
    class LaneEvDetails extends Model {
        public id!: number;
        public lane_id!: number | null;
        public k_count!: number | null;
        public is_ev!: number;
        public threshold_distance!: number;
        public th_distance!: number | null;
    }

    LaneEvDetails.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            lane_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            k_count: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            is_ev: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            threshold_distance: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            th_distance: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "LaneEvDetails",
            tableName: "lane_ev_details",
            timestamps: false, // Disable timestamps
        }
    );

    return LaneEvDetails;
}
