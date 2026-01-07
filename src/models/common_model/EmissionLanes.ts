import { Sequelize, Model, DataTypes } from 'sequelize';

export default function defineEmissionLanesModel(sequelize: Sequelize) {
    class EmissionLanes extends Model {
        public name!: string;
        public emission!: number;
        public total_ton_miles!: number;
        public quarter!: string;
        public shipments!: string;
        public year!: string;
        public region_id!: number;
        public division_id!: number;
    }

    EmissionLanes.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            emission: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            total_ton_miles: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            quarter: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            shipments: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            year: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            region_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            division_id: {
                type: DataTypes.INTEGER,
            },
        },
        {
            sequelize,
            modelName: 'EmissionLanes',
            tableName: 'emission_lanes',
            timestamps: false, // Disable timestamps if needed
        }
    );


    return EmissionLanes;
}
