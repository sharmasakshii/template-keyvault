import { Sequelize, DataTypes, Model } from 'sequelize';

export default function defineCarrierLogoModel(sequelize: Sequelize) {
    class CarrierLogo extends Model {
        public carrier_code!: string;
        public carrier_name!: string;
        public path!: string;
    }

    CarrierLogo.init(
        {
            carrier_code: {
                type: DataTypes.STRING,
                allowNull: false, // Assuming the carrier_code is a required field
            },
            carrier_name: {
                type: DataTypes.STRING,
                allowNull: false, // Assuming carrier_name is a required field
            },
            path: {
                type: DataTypes.STRING,
                allowNull: false, // Assuming path is a required field
            },
        },
        {
            sequelize,
            modelName: 'CarrierLogo',
            tableName: 'carrier_logo',
            timestamps: false, // Disable timestamps if needed
        }
    );

    return CarrierLogo;
}
