import { Sequelize, DataTypes, Model } from 'sequelize';
import { commonFields } from '../commonModelAttributes/comonField';

export default function defineCarrierEmissionsModel(sequelize: Sequelize) {
    class CarrierEmissions extends Model {
        public name!: string;
        public emissions!: number;
        public total_ton_miles!: number;
        public carrier_name!: string;
        public carrier!: string;
        public quarter!: string;
        public shipments!: string;
        public year!: string;
        public region_id!: number;
        public carrier_logo!: string;
        public time_id!: number;
    }

    CarrierEmissions.init(
        {
            ...commonFields.commonCarrierEmission,
            carrier_logo: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            time_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'CarrierEmissions',
            tableName: 'carrier_emissions',
            timestamps: false, // Disable timestamps if needed
        }
    );

    // Define relationships

    return CarrierEmissions;
}
