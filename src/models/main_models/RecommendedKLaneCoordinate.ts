import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineRecommendedKLaneCoordinateModel(sequelize: Sequelize) {
    class RecommendedKLaneCoordinate extends Model {
        public lane_id!: number;
        public k_count!: number;
        public latitude!: string;
        public longitude!: string;
        public created_on!: string;
        public modified_by!: number;
        public created_by!: number;
        public modified_on!: string;
        public is_deleted!: number;
    }

    RecommendedKLaneCoordinate.init(
        {
            lane_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            k_count: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            latitude: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            longitude: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            created_on: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            modified_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            modified_on: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            is_deleted: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'RecommendedKLaneCoordinate',
            tableName: 'recommended_k_lane_coordinate',
            timestamps: false, // Disable timestamps as per the original model
        }
    );

    return RecommendedKLaneCoordinate;
}
