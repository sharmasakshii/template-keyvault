import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineSummerisedBusinessUnit(sequelize: Sequelize) {
    class SummerisedBusinessUnit extends Model {
        public id!: number;
        public emissions!: number;
        public total_ton_miles!: number;
        public bu_id!: number;
        public quarter!: number;
        public year!: number;
        public shipments!: string;
        public division_id!: number;
        public region_id!: number;
        public time_id!: number;
    }

    SummerisedBusinessUnit.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
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
            shipments: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            bu_id: {
                type: DataTypes.INTEGER,
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
            region_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            time_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            sequelize,
            modelName: 'SummerisedBusinessUnit',
            tableName: 'summerised_business_unit',
            timestamps: false,
        }
    );



    return SummerisedBusinessUnit;
}