import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineSummerisedFacilitiesModel(sequelize: Sequelize) {
    // Load associated models


    class SummerisedFacilities extends Model {
        public emission!: string;
        public total_ton_miles!: string;
        public shipments!: string;
        public facilities_id!: number;
        public region_id!: number;
        public quarter!: string;
        public year!: string;
        public origin!: string;
        public destination!: string;
        public name!: string;
        public carrier!: string;
        public carrier_name!: string;
        public carrier_logo!: string;
    }

    SummerisedFacilities.init(
        {
            emission: {
                type: DataTypes.STRING,
            },
            total_ton_miles: {
                type: DataTypes.STRING,
            },
            shipments: {
                type: DataTypes.STRING,
            },
            facilities_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            region_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            quarter: {
                type: DataTypes.STRING,
            },
            year: {
                type: DataTypes.STRING,
            },
            origin: {
                type: DataTypes.STRING,
            },
            destination: {
                type: DataTypes.STRING,
            },
            name: {
                type: DataTypes.STRING,
            },
            carrier: {
                type: DataTypes.STRING,
            },
            carrier_name: {
                type: DataTypes.STRING,
            },
            carrier_logo: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: 'SummerisedFacilities',
            tableName: 'summerised_facilities',
        }
    );


    return SummerisedFacilities;
}
