import { Sequelize, DataTypes, Model } from 'sequelize';


export default function defineCarrierEmissionReductionModel(sequelize: Sequelize) {
    class CarrierEmissionReduction extends Model {
        public lane_name!: string;
        public carrier!: string;
        public emission_reduction!: number;
        public smartway_emission!: number;
        public cost!: number;
        public dollar_per_reduction!: number;
        public created_on!: Date;
        public modified_on!: Date;
        public is_deleted!: boolean;
    }

    CarrierEmissionReduction.init(
        {
            lane_name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            carrier: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            emission_reduction: {
                type: DataTypes.TINYINT,
                allowNull: false,
            },
            smartway_emission: {
                type: DataTypes.TINYINT,
                allowNull: false,
            },
            cost: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            dollar_per_reduction: {
                type: DataTypes.FLOAT,
                allowNull: true,
            },
            created_on: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            modified_on: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            is_deleted: {
                type: DataTypes.BOOLEAN,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'CarrierEmissionReduction',
            tableName: 'carrier_emission_reduction', // Adjusted table name
            timestamps: false, // Disable timestamps if needed
        }
    );


    return CarrierEmissionReduction;
}
