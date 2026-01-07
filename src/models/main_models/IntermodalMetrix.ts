import { Sequelize, DataTypes, Model } from "sequelize";

export default function defineIntermodalMetrixModel(sequelize: Sequelize) {
    class IntermodalMetrix extends Model {
        public distance!: number | null;
        public time!: number | null;
        public intermodal_lane_id!: number | null;
    }

    IntermodalMetrix.init(
        {
            distance: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            time: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
            intermodal_lane_id: {
                type: DataTypes.BIGINT,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'IntermodalMetrix',
            tableName: 'intermodal_metrix',
            timestamps: false, // Disable timestamps if not required
        }
    );

    // Define associations
  

    return IntermodalMetrix;
}
