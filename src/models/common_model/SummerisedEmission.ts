import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineSummerisedEmissionModel(sequelize: Sequelize) {
    // Load the associated Region model

    class SummerisedEmission extends Model {
        public region_id!: number;
        public time_id!: number;
        public emissions!: number;
        public total_ton_miles!: number;
        public status!: boolean;
        public quarter!: string;
        public year!: string;
        public division_id!: number;
    }

    SummerisedEmission.init(
        {
            region_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            time_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            emissions: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            total_ton_miles: {
                type: DataTypes.FLOAT,
                allowNull: false,
            },
            status: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
            },
            quarter: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            year: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            division_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'SummerisedEmission',
            tableName: 'summerised_emissions',
        }
    );



    return SummerisedEmission;
}
