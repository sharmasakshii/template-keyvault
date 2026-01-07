import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineCostByIntermodalModel(sequelize: Sequelize) {
    class CostByIntermodal extends Model {
        public id!: number;
        public uuid!: string;
        public rail_time_const!: number | null;
        public intermodal_id!: number | null;
        public cost_per_mile!: number | null;
        public created_on!: Date | null;
        public created_by!: number | null;
        public modified_on!: Date | null;
        public modified_by!: number | null;
        public is_deleted!: number | null;
    }

    CostByIntermodal.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            uuid: {
                type: DataTypes.UUID,
                allowNull: false,
            },
            rail_time_const: {
                type: DataTypes.DECIMAL(8, 6),
                allowNull: true,
            },
            intermodal_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            cost_per_mile: {
                type: DataTypes.DECIMAL(8, 2),
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
        },
        {
            sequelize,
            modelName: 'CostByIntermodal',
            tableName: 'cost_by_intermodal',
            timestamps: false, // Disable timestamps if not required
        }
    );


    return CostByIntermodal;
}
