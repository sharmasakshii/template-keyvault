import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineCostByLaneModel(sequelize: Sequelize) {
    class CostByLane extends Model {
        public id!: number;
        public uuid!: string;
        public lane_id!: number | null;
        public created_on!: Date | null;
        public created_by!: number | null;
        public modified_on!: Date | null;
        public modified_by!: number | null;
        public is_deleted!: number | null;
        public dollar_per_mile!: number | null;
    }

    CostByLane.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            uuid: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            lane_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            created_on: {
                type: DataTypes.DATE,
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
            modified_by: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            is_deleted: {
                type: DataTypes.TINYINT,
                allowNull: true,
            },
            dollar_per_mile: {
                type: DataTypes.DECIMAL(8, 2),
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'CostByLane',
            tableName: 'cost_by_lane',
            timestamps: false, // Disable timestamps if not required
        }
    );



    return CostByLane;
}
