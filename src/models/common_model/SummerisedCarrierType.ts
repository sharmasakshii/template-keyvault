import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineSummerisedCarrierTypeModel(sequelize: Sequelize) {
    class SummerisedCarrierType extends Model {
        public id!: number;
        public name!: string | null;
        public emissions!: number | null;
        public total_ton_miles!: number | null;
        public shipments!: number | null;
        public year!: number | null;
        public time_id!: number | null;
        public carrier_type_id!: number;
        public carrier!: string | null;
        public carrier_name!: string | null;
        public carrier_logo!: string | null;
        public region_id!: number;
    }

    SummerisedCarrierType.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            emissions: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            total_ton_miles: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            shipments: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            time_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            region_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            carrier_type_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            carrier: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            carrier_name: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            carrier_logo: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'SummerisedCarrierType',
            tableName: 'summerised_carrier_type',
            schema: 'greensight_brambles',
            timestamps: false,
        }
    );

    return SummerisedCarrierType;
}