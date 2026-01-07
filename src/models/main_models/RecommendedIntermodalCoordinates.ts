import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineRecommendedIntermodalCoordinatesModel(sequelize: Sequelize) {
    class RecommendedIntermodalCoordinates extends Model {
        public uuid!: string;
        public intermodal_lane_id!: number;
        public latitude!: number;
        public logitude!: number;
    }

    RecommendedIntermodalCoordinates.init(
        {
            uuid: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            intermodal_lane_id: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            latitude: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            logitude: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "RecommendedIntermodalCoordinates",
            tableName: "recommended_intermodal_coordinates",
            timestamps: false, // Disable timestamps
        }
    );

    return RecommendedIntermodalCoordinates;
}
