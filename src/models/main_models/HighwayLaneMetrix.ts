import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineHighwayLaneMetrixModel(sequelize: Sequelize) {
    class HighwayLaneMetrix extends Model {
        public lane_id!: number;
        public k_count!: number;
        public time!: number;
        public distance!: number;
        public cost!: number;
        public created_by!: number;
        public created_on!: string;
        public modified_by!: number;
        public modified_on!: string;
        public is_deleted!: number;
    }

    HighwayLaneMetrix.init(
        {
            lane_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            k_count: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            time: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            distance: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            cost: {
                type: DataTypes.DECIMAL(18, 2),
                allowNull: false,
            },
            created_by: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            created_on: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            modified_by: {
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
            modelName: 'HighwayLaneMetrix',
            tableName: 'highway_lane_metrix',
            timestamps: false,
        }
    );
    
    return HighwayLaneMetrix;
}
