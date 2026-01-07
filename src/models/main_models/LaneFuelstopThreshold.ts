import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineLaneFuelstopThresholdModel(sequelize: Sequelize) {
    class LaneFuelstopThreshold extends Model {
        public id!: number;
        public lane_id!: number;
        public k_count!: number;
        public is_available!: number;
        public threshold_distance!: number;
        public fuel_code!: string;
    }

    LaneFuelstopThreshold.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            lane_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            k_count: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            is_available: {
                type: DataTypes.TINYINT,
                allowNull: false,
            },
            threshold_distance: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            fuel_code: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "LaneFuelstopThreshold",
            tableName: "lane_fuelstop_threshold",
            timestamps: false, // No createdAt/updatedAt fields
        }
    );

    return LaneFuelstopThreshold;
}
